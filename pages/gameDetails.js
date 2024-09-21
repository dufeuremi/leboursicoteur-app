import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  Image,
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomSheet from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import textStyles from "../config-texts";
import spacings from "../config-spacing";
import colors from "../config-colors";
import Button from "../components/button";
import InfoBanner from "../components/info";
import RankItem from "../components/rankItem";
import MarketBadge from "../components/marketBadge";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBar from "../components/searchInput";
import configSpacing from "../config-spacing";
import AmountInput from "../components/amountInput";
import configColors from "../config-colors";
import { LineChart } from "react-native-gifted-charts"; // Import du LineChart
import { Keyboard } from 'react-native';
import ClosingInfo from "../components/closingInfo";
import StockChart from "../components/stock";
import StockLogo from "../components/stockLogo";
import SkeletonLoader from "../components/skeletonLoader";

export default function Game() {
  const [refreshing, setRefreshing] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [stockID, setStockID] = useState("");
  const [sellAmount, setSellAmount] = useState(0); // Track the amount in euros to sell
  const [selectedStockToSell, setSelectedStockToSell] = useState(null); // Track selected stock for selling
  const [totalInvestment, setTotalInvestment] = useState(0); // Track total euros input by the user

  const bottomSheetRef = useRef(null);
  const situationSheetRef = useRef(null);
  const marketSheetRef = useRef(null);
  const buySheetRef = useRef(null);
  const sellSheetRef = useRef(null);
  const xxxSheetRef = useRef(null);
  const yyySheetRef = useRef(null);
  const sellPageOneSheetRef = useRef(null);
  const sellPageTwoSheetRef = useRef(null);
  const userEvolution = useRef(null);

  

  const generateRandomStockData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - (29 - i));
      data.push({
        value: Math.floor(Math.random() * 1000) + 500, // Valeur aléatoire entre 500 et 1500
        label: `${date.getDate()}/${date.getMonth() + 1}`,
      });
    }
    return data;
  };

  const stockChartData = useMemo(() => generateRandomStockData(), []);


  const navigation = useNavigation();
  const API_URL = "https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/game/get";

  const snapPoints = useMemo(() => ["100%", "100%"], []);

  const fetchData = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const selectedGameId = await AsyncStorage.getItem("selected_game_id");

      if (!userToken || !selectedGameId) {
        console.error("Token ou ID de jeu non trouvé dans le cache");
        return;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: userToken,
        },
        body: JSON.stringify({ game_id: selectedGameId }),
      });

      const data = await response.json();
      setGameData(data);
      navigation.setOptions({ title: data.game.name });
      setRefreshing(false);
      
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Définir un intervalle pour rafraîchir les données toutes les 8 secondes
    const interval = setInterval(() => {
      fetchData(); // Appeler fetchData pour actualiser les données
    }, 4000);

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gameData) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = gameData.game.finish_at - now;
        setTimeRemaining(timeLeft);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameData]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}j • ${hours}h • ${minutes}min • ${seconds}s`;
  };

  const handleSheetChanges = useCallback((index, ref) => {
    if (index === -1) {
      ref.current?.close();
    }
  }, []);

  if (!gameData) {
    return (
      <View         style={{
        paddingHorizontal: spacings.spacing.medium,
        backgroundColor: colors.grey1,
        height: "screen"
      }}>
      {/* Exemple d'utilisation d'un skeleton avec un rectangle */}
      <SkeletonLoader width={300} height={50} borderRadius={spacings.corner.small} />
      <SkeletonLoader width={320} height={200} borderRadius={spacings.corner.small} />
      <SkeletonLoader width={300} height={60} borderRadius={spacings.corner.small} />
      <SkeletonLoader width={320} height={300} borderRadius={spacings.corner.small} />
    </View>
    );
  }

  const calculatePortfolioValue = (userData) => {
    const cash = userData.cash;
    const stockValue = userData.wallet.data.reduce((acc, stock) => {
      // Trouver la valeur actuelle de l'action
      const currentStock = gameData.stock.find((s) => s.name === stock.name);
      const stockPrice = currentStock ? currentStock.value : 0; // Utiliser 0 si la valeur n'est pas trouvée
      return acc + stock.quantity * stockPrice;
    }, 0);
    return cash + stockValue;
  };

  const sortedRankData = gameData.users_data
    .map((userData) => ({
      name: `${gameData.users.find((u) => u.id === userData._boursicoteur_users_id).firstname} ${gameData.users.find((u) => u.id === userData._boursicoteur_users_id).lastname}`,
      rank: "", // Le rang sera défini après le tri
      portfolioValue: calculatePortfolioValue(userData).toFixed(2),
      cash: userData.cash,
      userId: userData._boursicoteur_users_id,
    }))
    .sort((a, b) => b.portfolioValue - a.portfolioValue);

  // Mise à jour des rangs après le tri
  sortedRankData.forEach((user, index) => {
    user.rank = index === 0 ? "1er" : `${index + 1}ème`;
  });


  const marketData = gameData.users_data[0].wallet.data.map((stock, index) => {
    // Trouver la valeur actuelle de l'action dans gameData.stock
    const currentStock = gameData.stock.find((s) => s.name === stock.name);
    const stockPrice = currentStock ? currentStock.value : 0; // Utiliser 0 si la valeur n'est pas trouvée

    return {
      icon: require("../assets/adaptive-icon.png"),
      name: stock.name,
      value: `${stock.name} / ${stock.quantity.toFixed(2)}`,
      amount: `${(stock.quantity * stockPrice).toFixed(2)}`, // Utiliser le prix réel ici
    };
  });

  const userRank =
    sortedRankData.findIndex((user) => user.userId === gameData.user_id) + 1;
  const totalPlayers = sortedRankData.length;
  const userRankText = userRank === 1 ? "1er" : `${userRank}ème`;



  
  return (
    <View>
      <ScrollView
        style={{
          paddingHorizontal: spacings.spacing.medium,
          backgroundColor: colors.grey1,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ marginBottom: 120 }}>
  
          <ClosingInfo style={{marginBottom: 0}}></ClosingInfo>
          <Text style={[textStyles.body, { marginVertical:0 }]}>

          </Text>

          <Text style={[textStyles.heading1, { marginVertical: 15 }]}>
            Classement
          </Text>
          <InfoBanner
            iconType="time"
            text={`Il reste ${formatTime(timeRemaining)}`}
            style={{ flex: 1, paddingHorizontal: spacings.spacing.large, marginVertical: 15 }}
          />
                    <Text style={[textStyles.body, { marginVertical: 0 }]}>
            
          </Text>
          <View style={styles.container}>
            <View style={styles.walletContainer}>
              <Ionicons
                name="medal-outline"
                size={24}
                color={colors.black1}
                style={styles.icon}
              />
              <Text style={[textStyles.heading2, { marginVertical: 15 }]}>
                {userRankText} / {totalPlayers} boursicoteurs
              </Text>
            </View>
          </View>
          <View style={styles.container}>
            <View>
            <View>
  {sortedRankData.slice(0, 3).map((user, index) => (
    <RankItem
      key={`${user.userId}-${index}`} // Combine userId with index to ensure uniqueness
      user={{
        avatar: "../assets/adaptive-icon.png",
        name: user.name,
        rank: user.rank,
        points: "N/A",
        amount: `${user.portfolioValue}`,
        change: "N/A",
      }}
    />
  ))}
</View>

              <View style={{ marginTop: 20 }}>
                <Button
                  type="secondary"
                  title="Voir le classement"
                  iconName="arrow-forward"
                  onPress={() => bottomSheetRef.current?.snapToIndex(1)}
                />
              </View>
            </View>
          </View>
          <Text style={[textStyles.heading1, { marginVertical: 15 }]}>
            Mon portefeuille
          </Text>
          <View style={styles.container}>
          <View style={styles.walletContainer}>
  <Ionicons
    name="wallet-outline"
    size={24}
    color={colors.black1}
    style={styles.icon}
  />
  <Text style={[textStyles.heading2, { marginVertical: 15 }]}>
    {calculatePortfolioValue(gameData.users_data[0]).toFixed(2)} €
  </Text>

  
</View>
<Text style={[textStyles.body, { marginVertical: 5 }]}>
    Dont capital: {(calculatePortfolioValue(gameData.users_data[0]) - gameData.users_data[0].cash).toFixed(2)} €
  </Text>
  <Text style={[textStyles.body, { marginVertical: 15 }]}>
    Dont liquidités: {gameData.users_data[0].cash.toFixed(2)} €
  </Text>
 <View style={styles.chartContainer}>
          <StockChart></StockChart>
            </View>
            <Button
              type="secondary"
              title="Voir en détails"
              iconName="arrow-forward"
              onPress={() => situationSheetRef.current?.snapToIndex(1)}
            />
          </View>
          <Text style={[textStyles.heading2, { marginVertical: 15 }]}>
            Mes investissements
          </Text>
          {marketData.map((market, index) => (
            <TouchableOpacity
              key={`${market.name}-${index}`} // Combine market name with index to ensure uniqueness
              onPress={() => {
                setStockID(market);
                marketSheetRef.current?.snapToIndex(0);
              }}
            >
              <MarketBadge
                icon={market.icon}
                value={market.value}
                amount={market.amount}
                extraInfo={market.extraInfo}
                name={market.name}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.mainContainer}>

        <View style={styles.fixedButtonContainer}>
          <View style={{ width: "49%" }}>
            <Button
              type="primary"
              title="Acheter"
              iconName="arrow-down-outline"
              onPress={() => buySheetRef.current?.snapToIndex(0)}
            />
          </View>
          <View style={{ width: "49%" }}>
            <Button
              type="secondary"
              title="Vendre"
              iconName="arrow-up-outline"
              onPress={() => sellSheetRef.current?.snapToIndex(0)}
            />
          </View>
        </View>
        
      </View>
      {/* Classement 3*/}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Par défaut, Bottom Sheet est cachée
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, bottomSheetRef)}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.containerHeadline}>Classement</Text>
          <View style={styles.container}>
            <View style={styles.walletContainer}>
              <Ionicons
                name="medal-outline"
                size={24}
                color={colors.black1}
                style={styles.icon}
              />
              <Text style={[textStyles.heading2, { marginVertical: 15 }]}>
                {userRankText} / {totalPlayers}
              </Text>
              <Text
                style={[
                  textStyles.heading2,
                  { color: colors.indigo, marginLeft: 10, fontSize: 18 },
                ]}
              >
                ↗ 1 place(s)
              </Text>
            </View>
          </View>
          {sortedRankData.map((user, index) => (
            <RankItem
              key={`${user.userId}-${index}`} // Combine userId with index to ensure uniqueness
              user={{
                avatar: "../assets/adaptive-icon.png",
                name: user.name,
                rank: user.rank,
                points: "N/A",
                amount: `${user.portfolioValue}`,
                change: "N/A",
              }}
            />
          ))}
        </View>
      </BottomSheet>
      {/* Portefeuille*/}
      <BottomSheet
        ref={situationSheetRef}
        index={-1} // Par défaut, Bottom Sheet est cachée
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, situationSheetRef)}
        style={styles.bottomSheet}
      >
        <Text
          style={[
            textStyles.heading1,
            { marginVertical: 15, textAlign: "center" },
          ]}
        >
          Portefeuille
        </Text>
        <View style={styles.container}>
        <View style={styles.walletContainer}>
  <Ionicons
    name="wallet-outline"
    size={24}
    color={colors.black1}
    style={styles.icon}
  />
  <Text style={[textStyles.heading2, { marginVertical: 15 }]}>
    {calculatePortfolioValue(gameData.users_data[0]).toFixed(2)} €
  </Text>


  
</View>
<Text style={[textStyles.body, { marginVertical: 5 }]}>
    Dont capital: {(calculatePortfolioValue(gameData.users_data[0]) - gameData.users_data[0].cash).toFixed(2)} €
  </Text>
  <Text style={[textStyles.body, { marginVertical: 15 }]}>
    Dont liquidités: {gameData.users_data[0].cash.toFixed(2)} €
  </Text>
        </View>
      </BottomSheet>
      
      <BottomSheet
        ref={marketSheetRef}
        index={-1} // Par défaut, Bottom Sheet est cachée
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, marketSheetRef)}
      >
        <View style={styles.bottomSheet}>
        <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
  <View style={{marginTop: 20}}><StockLogo name={stockID.name} /></View>
  <Text style={textStyles.heading1}>{stockID.name} </Text>
</View>

          <Text style={textStyles.heading1}>{stockID.amount} € </Text>

          <StockChart></StockChart>
        </View>
      </BottomSheet>

      {/* Achat partie 1 */}
      <BottomSheet
        ref={buySheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, buySheetRef)}
      >
        <View>
          <ScrollView
            contentContainerStyle={{ padding: configSpacing.spacing.medium }}
          >
            <Text style={textStyles.heading1}>Acheter</Text>
            <Text style={[textStyles.body, { color: colors.black2 }]}>
              Sélectionner une position
            </Text>
            <SearchBar placeholder="Rechercher une entreprise..." />

            {gameData.stock.map((company, index) => (
              <TouchableOpacity
                key={`${company.name}-${index}`} // Assure l'unicité des clés
                onPress={() => {
                  setStockID(company);
                  buySheetRef.current?.close(); // Ferme le premier BottomSheet
                  xxxSheetRef.current?.snapToIndex(0); // Ouvre le second BottomSheet (Achat partie 2)
                }}
              >
                <MarketBadge
                  icon={require("../assets/adaptive-icon.png")} // Remplacez par l'icône appropriée si disponible
                  name={company.name}
                  value={company.name} // Passe la valeur en tant que nombre
                  amount={company.value.toFixed(2)} // Montant à afficher, formaté en euros
                  extraInfo={company.extraInfo || ""} // Informations supplémentaires, si disponibles
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          
        </View>
      </BottomSheet>

      {/* Achat partie 2 */}
      <BottomSheet
        ref={xxxSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, xxxSheetRef)}
      >
        <View style={styles.bottomSheet}>
        <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
  <View style={{marginTop: 20}}><StockLogo name={stockID.name} /></View>
  <Text style={textStyles.heading1}>{stockID.name} </Text>
</View>

        <Text style={[textStyles.body, { color: colors.black2 }]}>
            Détails de l'action
          </Text>
          <View style={styles.walletContainer}>
            <Ionicons
              name="logo-euro"
              size={24}
              color={colors.black1}
              style={styles.icon}
            />
            <Text style={[textStyles.heading2, { marginVertical: 15 }]}>
              {typeof stockID.value === 'number' ? `${stockID.value.toFixed(2)}` : "N/A"}
            </Text>

            
          </View>
          <StockChart></StockChart>
          <Button
            type="primary"
            iconName="logo-euro"
            title="Acheter"
            onPress={() => {
              yyySheetRef.current?.snapToIndex(0); // Ouvre Achat partie 3
              xxxSheetRef.current?.close(); // Ferme Achat partie 2
            }}
          />
        </View>
      </BottomSheet>

      {/* Achat partie 3 */}
      <BottomSheet
        ref={yyySheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, yyySheetRef)}
      >
        <View style={styles.bottomSheet}>
          <Text style={textStyles.heading1}>Montant à investir</Text>

         <Text
  style={[
    textStyles.body,
    { color: colors.black2, marginVertical: 10 },
  ]}
>
  Solde du compte
</Text>
<Text
  style={[
    textStyles.heading2,
    { color: colors.black1, marginBottom: 10 },
  ]}
>
  {gameData.users_data[0].cash.toFixed(2)} €
</Text>

<AmountInput
  placeholder="Montant"
  keyboard="digits"
  capitalize="yes"
  value={totalInvestment} // The value for total investment
  onChangeText={(value) => setTotalInvestment(Number(value))} // Update the state as the user types
/>



<Button
  type="primary"
  title="Confirmer l'achat"
  iconName="checkmark-outline"
  onPress={async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) {
        alert("Erreur : Token utilisateur introuvable.");
        return;
      }

      const userCash = gameData.users_data[0].cash;

      if (totalInvestment > userCash) {
        alert("Erreur : Le montant dépasse votre solde disponible.");
        return;
      }

      // Calculate the quantity to purchase
      const stockPrice = stockID.value;
      const purchaseAmount = totalInvestment / stockPrice;

      // Prepare the API request body
      const body = {
        name: stockID.name,  // Company name
        quantity: purchaseAmount,  // Quantity to purchase
        game_id: 23  // Replace with the actual game_id if needed
      };

      const response = await fetch("https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/game/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userToken,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Close popup, show success message, and update cash balance
        yyySheetRef.current?.close();
        buySheetRef.current?.close();
        alert("Achat effectué avec succès !");
        fetchData()
        // Hide keyboard upon success
        Keyboard.dismiss(); // Hide the keyboard

        // Update user's cash in the front-end
        const newCash = data.new_cash;
        setGameData((prevGameData) => ({
          ...prevGameData,
          users_data: prevGameData.users_data.map((userData) =>
            userData._boursicoteur_users_id === gameData.user_id
              ? { ...userData, cash: newCash }
              : userData
          ),
        }));
      } else {
        // Error: Show error message
        alert(`Erreur lors de l'achat : ${data.message || "Veuillez réessayer."}`);
      }
    } catch (error) {
      console.error("Erreur lors de la tentative d'achat :", error);
      alert("Une erreur est survenue, veuillez réessayer.");
    }
  }}
/>



        </View>
      </BottomSheet>

      {/* Vente partie 1 */}
      <BottomSheet
        ref={sellSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, sellSheetRef)}
      >
        <View>
          <ScrollView
            contentContainerStyle={{ padding: configSpacing.spacing.medium }}
          >
            <Text style={textStyles.heading1}>Vendre</Text>
            <Text
              style={[
                textStyles.body,
                {
                  color: colors.black2,
                  marginBottom: configSpacing.spacing.medium,
                },
              ]}
            >
              Sélectionner une position
            </Text>

            {marketData.map((market, index) => (
             <TouchableOpacity
             key={`${market.name}-${index}`} // Ensure unique key
             onPress={() => {
               setSelectedStockToSell(market); // Set the selected stock
               sellPageOneSheetRef.current?.snapToIndex(0); // Open Vente Partie 2
               sellSheetRef.current?.close(); // Close Vente Partie 1
             }}
           >
             <MarketBadge
               icon={market.icon}
               value={market.value}
               amount={market.amount}
               extraInfo={market.extraInfo}
               name={market.name}
             />
           </TouchableOpacity>
           
            ))}
          </ScrollView>
        </View>
      </BottomSheet>
      {/* Vente partie 2 */}
      <BottomSheet
  ref={sellPageOneSheetRef}
  index={-1}
  snapPoints={snapPoints}
  enablePanDownToClose={true}
  onChange={(index) => handleSheetChanges(index, sellPageOneSheetRef)}
>
  <View style={styles.bottomSheet}>
    {selectedStockToSell ? ( // Only render if a stock is selected
      <>
        <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
  <View style={{marginTop: 20}}><StockLogo name={selectedStockToSell.name} /></View>
  <Text style={textStyles.heading1}>{selectedStockToSell.name} </Text>
</View>
        <Text style={[textStyles.body, { color: colors.black2 }]}>
          Évolution depuis l'achat
        </Text>
        <View style={styles.walletContainer}>
          <Ionicons
            name="logo-euro"
            size={24}
            color={colors.black1}
            style={styles.icon}
          />
          <Text style={[textStyles.heading2, { marginVertical: 15 }]}>
            {selectedStockToSell.amount} €
          </Text>

        </View>
        <StockChart></StockChart>
        <Button
  type="primary"
  iconName="logo-euro"
  title="Vendre "
  onPress={() => {
    sellPageTwoSheetRef.current?.snapToIndex(0); // Open Vente Partie 3
    sellPageOneSheetRef.current?.close(); // Close Vente Partie 2
  }}
/>

      </>
    ) : (
      <Text>Aucune action sélectionnée.</Text>
    )}
  </View>
</BottomSheet>

      {/* Vente partie 3*/}
    <BottomSheet
  ref={sellPageTwoSheetRef}
  index={-1}
  snapPoints={snapPoints}
  enablePanDownToClose={true}
  onChange={(index) => handleSheetChanges(index, sellPageTwoSheetRef)}
>
  <View style={styles.bottomSheet}>
    {selectedStockToSell ? (
      <>
    <Text
  style={[
    textStyles.body,
    { color: colors.black1, marginVertical: 10 },
  ]}
>
Actions détenues
</Text>

        <Text
          style={[
            textStyles.heading2,
            { color: colors.black1, marginVertical: 10 },
          ]}
        >
           {selectedStockToSell.value} actions
        </Text>
        <Text
          style={[
            textStyles.body,
            { color: colors.black1, marginVertical: 10 },
          ]}
        >
          {selectedStockToSell.amount} €
        </Text>

        <AmountInput
          placeholder="Montant"
          keyboard="digits"
          capitalize="yes"
          value={sellAmount} // The sell amount in euros
          onChangeText={(value) => setSellAmount(Number(value))} // Update sellAmount state
        />

        <Button
          type="primary"
          title="Confirmer la vente"
          iconName="checkmark-outline"
          onPress={async () => {
            try {
              const userToken = await AsyncStorage.getItem("userToken");
              if (!userToken) {
                alert("Erreur : Token utilisateur introuvable.");
                return;
              }

              const stockPrice = selectedStockToSell.amount / selectedStockToSell.quantity; // Calculate price per action
              const sellQuantity = sellAmount / stockPrice; // Calculate quantity to sell

              if (sellQuantity > selectedStockToSell.quantity) {
                alert("Erreur : Le montant dépasse la quantité d'actions détenues.");
                return;
              }

              // Prepare the API request body
              const body = {
                name: selectedStockToSell.name,  // Company name
                quantity: sellQuantity,  // Quantity to sell
              };

              const response = await fetch("https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/game/sell", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: userToken,
                },
                body: JSON.stringify(body),
              });

              const data = await response.json();

              if (response.ok) {
                // Success: Close popup, show success message, and refresh the page
                sellPageTwoSheetRef.current?.close();
                sellSheetRef.current?.close();
                Keyboard.dismiss(); // Hide the keyboard
                alert("Vente effectuée avec succès !");
                
                // Refresh the data on the page
                fetchData();
              } else {
                // Error: Show error message
                alert(`Erreur lors de la vente : ${data.message || "Veuillez réessayer."}`);
              }
            } catch (error) {
              console.error("Erreur lors de la tentative de vente :", error);
              alert("Une erreur est survenue, veuillez réessayer.");
            }
          }}
        />
      </>
    ) : (
      <Text>Aucune action sélectionnée.</Text>
    )}
  </View>
</BottomSheet>

   
    </View>
  );
}

// Define styles for the button
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey2,
    borderRadius: spacings.corner.medium,
    padding: spacings.spacing.medium,
    borderWidth: 0,
    width: "100%",
    marginBottom: spacings.spacing.small,
  },
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: colors.grey3,
    padding: spacings.spacing.medium,
    borderRadius: spacings.corner.medium,
    alignItems: "center",
    marginTop: spacings.spacing.large,
  },
  buttonText: {
    ...textStyles.heading2,
    color: colors.black1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    margin: spacings.spacing.medium,
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: "600",
    padding: 20,
  },
  bottomSheet: {
    borderRadius: spacings.corner.large,
    padding: spacings.spacing.medium,
  },
  containerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: colors.background, // Ajustez selon votre configuration
  },
  mainContainer: {
    flex: 2,
    position: "relative",
    width: "100%",
  },
  scrollableContent: {
    paddingBottom: 120, // Pour éviter que le contenu soit caché par les boutons
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "space-between",
    padding: 20,
    flexDirection: "row",

    backgroundColor: colors.background,
  },
  button: {
    flex: 1, // Prendre une part égale de l'espace disponible
    marginHorizontal: 5, // Ajouter de l'espace entre les boutons
  },
  textContent: {
    padding: 20,
    fontSize: 16,
    textAlign: "center",
    // Autres styles pour votre contenu
  },
});
