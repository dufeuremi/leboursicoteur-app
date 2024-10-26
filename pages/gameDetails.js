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
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomSheet from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import textStyles from "../config-texts";
import configSpacing from "../config-spacing";
import spacings from "../config-spacing";
import colors from "../config-colors";
import Button from "../components/button";
import InfoBanner from "../components/info";
import RankItem from "../components/rankItem";
import MarketBadge from "../components/marketBadge";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBar from "../components/searchInput";
import AmountInput from "../components/amountInput";
import { LineChart } from "react-native-gifted-charts";
import ClosingInfo from "../components/closingInfo";
import StockChart from "../components/stockChart";
import StockLogo from "../components/stockLogo";
import SkeletonLoader from "../components/skeletonLoader";
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';



export default function Game() {
  const [refreshing, setRefreshing] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [stockID, setStockID] = useState("");
  const [sellAmount, setSellAmount] = useState(0);
  const [selectedStockToSell, setSelectedStockToSell] = useState(null);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [reloading, setReloading] = useState(0);
  const [isAmountSelected, setIsAmountSelected] = useState(true);
  const [placeholder, setPlaceholder] = useState('Entrez le montant');
  const [quantity, setQuantity] = useState(0);
  

  const bottomSheetRef = useRef(null);
  const situationSheetRef = useRef(null);
  const marketSheetRef = useRef(null);
  const buySheetRef = useRef(null);
  const sellSheetRef = useRef(null);
  const xxxSheetRef = useRef(null);
  const yyySheetRef = useRef(null);
  const sellPageOneSheetRef = useRef(null);
  const sellPageTwoSheetRef = useRef(null);

  const generateRandomStockData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - (29 - i));
      data.push({
        value: Math.floor(Math.random() * 1000) + 500,
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
      if (data?.game?.name) {
        navigation.setOptions({ title: data.game.name });
      }
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Refresh de l'api
  }, []);

  useEffect(() => {
    fetchData(); // Appel API immédiat lors de l'arrivée sur la page
  
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
  
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    // Fonction qui calcule le temps restant et le met à jour
    const updateTimeRemaining = () => {
      if (gameData?.game?.finish_at) {
        const now = Date.now();
        const timeLeft = gameData.game.finish_at - now;
        setTimeRemaining(timeLeft);
      }
    };
  
    // Appel initial de la fonction pour mettre à jour le temps dès que la page est chargée
    updateTimeRemaining();
  
    // Intervalle pour continuer à mettre à jour toutes les 10 secondes
    const interval = setInterval(() => {
      updateTimeRemaining();
    }, 10000);
  
    // Nettoyage de l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, [gameData]);
  

  const formatTime = (ms) => {
    if (!ms) return 'N/A';
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

  const animationRef = useRef(null);
  const [isReversed, setIsReversed] = useState(false);

  useEffect(() => {
    let interval;

    const startAnimation = () => {
      if (animationRef.current) {
        if (!isReversed) {
          animationRef.current.play(0, 100); // Lecture en avant
        } else {
          animationRef.current.play(100, 0); // Lecture en reverse
        }
      }
    };

    // Lancer l'animation initiale
    startAnimation();

    // Inverser l'animation après chaque fin de lecture
    interval = setInterval(() => {
      setIsReversed((prev) => !prev);
      startAnimation();
    }, 10000); // Change toutes les 3 secondes

    return () => {
      clearInterval(interval); // Nettoyer l'intervalle à la fin
    };
  }, [isReversed]);


  if (!gameData || reloading == true) {
    return (
      <View style={{backgroundColor: colors.grey1, padding: spacings.spacing.medium}}
    >
      <SkeletonLoader width={330} height={50} borderRadius={spacings.corner.medium} />
      <SkeletonLoader width={330} height={60} borderRadius={spacings.corner.medium} />
      <SkeletonLoader width={180} height={30} borderRadius={spacings.corner.medium} />
      <SkeletonLoader width={330} height={400} borderRadius={spacings.corner.medium} />

    </View>
    );
  }

  const calculatePortfolioValue = (userData) => {
    if (!userData) {
      return 0;
    }
  
    const cash = userData.cash || 0;
    const userGameUserId = userData.id;
    if (!userGameUserId) {
      return 0;
    }
  
    const stockValue = gameData.wallet
      ?.filter((stock) => stock.game_user_id === userGameUserId)
      ?.reduce((acc, stock) => {
        const currentStock = gameData.stock?.find((s) => s.name === stock.name);
        const stockPrice = currentStock ? currentStock.value : 0;
        return acc + stock.value * stockPrice;
      }, 0) || 0;
  
    return cash + stockValue;
  };
  
  

  const sortedRankData =
    gameData.users_data?.map((userData) => {
      const user = gameData.users?.find(
        (u) => u.id === userData._boursicoteur_users_id
      );
      const name = user
        ? `${user.firstname} ${user.lastname}`
        : "Utilisateur inconnu";
      return {
        name: name,
        rank: "",
        portfolioValue: calculatePortfolioValue(userData).toFixed(2),
        cash: userData.cash || 0,
        userId: userData._boursicoteur_users_id,
      };
    })?.sort((a, b) => b.portfolioValue - a.portfolioValue) || [];

  sortedRankData.forEach((user, index) => {
    user.rank = index === 0 ? "1er" : `${index + 1}ème`;
  });

  const userRank =
    sortedRankData.findIndex((user) => user.userId === gameData.user_id) + 1;
  const totalPlayers = sortedRankData.length;
  const userRankText = userRank === 1 ? "1er" : `${userRank}ème`;

  const userData = gameData?.users_data?.find(
    (u) => u._boursicoteur_users_id === gameData.user_id
  ) || null;
  

if (userData && userData.id) {
  // Ici, tu es sûr que userData et userData.id existent
  console.log(userData.id);
} 




const marketData =
  gameData.wallet
    ?.map((stock, index) => {
      const currentStock = gameData.stock?.find(
        (s) => s.name === stock.name
      );
      const stockPrice = currentStock ? currentStock.value : 0;

      return {
        icon: require("../assets/adaptive-icon.png"),
        name: stock.name,
        value: `${stock.name} / ${stock.value.toFixed(2)}`,
        amount: `${(stock.value * stockPrice).toFixed(2)}`,
        quantity: stock.value,
      };
    }) || [];


console.log("length"+gameData.wallet.length);

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
        <View style={{ marginBottom: 0 }}>

        <InfoBanner
            iconType="time"
            text={`Il reste ${formatTime(timeRemaining)}`}
            style={{
              flex: 1,
              paddingHorizontal: spacings.spacing.large,
              marginBottom: spacings.spacing.large,
              flexDirection: "column"
            }}
            background="false"
          />  
          <View style={{ flex: 1,}}>
       </View>

          <Text style={[textStyles.body, { marginVertical: 0 }]}></Text>
<ClosingInfo></ClosingInfo>
          <Text style={[textStyles.heading1]}>
            Classement 
          </Text>

          <Text style={[textStyles.body, { marginVertical: 0 }]}></Text>


          <View style={styles.container2}>
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
            </View>
            <View>
              <View>
                {sortedRankData.slice(0, 3).map((user, index) => (
                  <RankItem
                    key={`${user.userId}-${index}`}
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
                {userData
                  ? calculatePortfolioValue(userData).toFixed(2)
                  : "N/A"}{" "}
                €
              </Text>
            </View>
            <Text style={[textStyles.body, { marginVertical: 5 }]}>
              Dont capital:{" "}
              {userData
                ? (
                    calculatePortfolioValue(userData) - userData.cash
                  ).toFixed(2)
                : "N/A"}{" "}
              €
            </Text>
            <Text style={[textStyles.body, { marginVertical: 15 }]}>
              Dont liquidités:{" "}
              {userData?.cash ? userData.cash.toFixed(2) : "N/A"} €
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
          <Text style={[textStyles.heading2, { marginTop: 30, marginBottom: 15 }]}>
  Mes investissements
</Text>
{(marketData.length === 0 || marketData.every(market => market.quantity === 0)) ? (
  <Text>Aucun investissement</Text>
) : (
  marketData.map((market, index) => (
    <TouchableOpacity
      key={`${market.name}-${index}`}
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
  ))
)}
<View style={{height: 140}}></View>
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
      {/* Classement */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
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
            </View>
          </View>
          {sortedRankData.map((user, index) => (
            <RankItem
              key={`${user.userId}-${index}`}
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
      {/* Portefeuille */}
      <BottomSheet
        ref={situationSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, situationSheetRef)}
        style={styles.bottomSheet}
      >
        <Text
          style={[
            textStyles.heading2,
            { marginVertical: 15, textAlign: "center" },
          ]}
        >
          Evolution portefeuille globale
        </Text>
        <StockChart></StockChart>
      </BottomSheet>

      <BottomSheet
        ref={marketSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, marketSheetRef)}
      >
        <View style={styles.bottomSheet}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ marginTop: 20 }}>
              <StockLogo name={stockID?.name || ""} />
            </View>
            <Text style={textStyles.heading1}>{stockID?.name || ""} </Text>
          </View>

          <Text style={textStyles.heading1}>{stockID?.amount || ""} € </Text>

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
            contentContainerStyle={{ padding: spacings.spacing.medium }}
          >
            <Text style={textStyles.heading1}>Acheter</Text>
            <Text style={[textStyles.body, { color: colors.black2 }]}>
              Sélectionner une position
            </Text>
            <SearchBar placeholder="Rechercher une entreprise..." />

            {gameData.stock?.map((company, index) => (
              <TouchableOpacity
                key={`${company.name}-${index}`}
                onPress={() => {
                  setStockID(company);
                  buySheetRef.current?.close();
                  xxxSheetRef.current?.snapToIndex(0);
                }}
              >
                <MarketBadge
                  icon={require("../assets/adaptive-icon.png")}
                  name={company.name}
                  value={company.name}
                  amount={company.value.toFixed(2)}
                  extraInfo={company.extraInfo || ""}
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ marginTop: 20 }}>
              <StockLogo name={stockID?.name || ""} />
            </View>
            <Text style={textStyles.heading1}>{stockID?.name || ""} </Text>
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
              {typeof stockID?.value === "number"
                ? `${stockID.value.toFixed(2)}`
                : "N/A"}
            </Text>
          </View>
          <StockChart></StockChart>
          <Button
            type="primary"
            iconName="logo-euro"
            title="Acheter"
            onPress={() => {
              yyySheetRef.current?.snapToIndex(0);
              xxxSheetRef.current?.close();
            }}
          />
        </View>
      </BottomSheet>
      <BottomSheet
  ref={yyySheetRef}
  index={-1}
  snapPoints={snapPoints}
  enablePanDownToClose={true}
  onChange={(index) => handleSheetChanges(index, yyySheetRef)}
>
  <ScrollView contentContainerStyle={{ padding: spacings.spacing.medium }}>
    <Text
      style={[
        textStyles.body,
        { color: colors.black2, marginVertical: 10 },
      ]}
    >
      Solde disponible
    </Text>
    <Text
      style={[
        textStyles.body,
        { color: colors.black1, marginBottom: 10 },
      ]}
    >
      {userData?.cash ? userData.cash.toFixed(2) : "N/A"} €
    </Text>

    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
      <View style={{ width: "45%" }}>
        <Button
          type={isAmountSelected ? 'primary' : 'secondary'}
          title="Montant"
          iconName="cash-outline"
          onPress={() => {
            setIsAmountSelected(true);
            setPlaceholder('Entrez le montant');
          }}
        />
      </View>
      <View style={{ width: "45%", marginLeft: 10 }}>
        <Button
          type={isAmountSelected ? 'secondary' : 'primary'}
          title="Quantité"
          iconName="layers-outline"
          onPress={() => {
            setIsAmountSelected(false);
            setPlaceholder('Entrez la quantité');
          }}
        />
      </View>
    </View>       

    <AmountInput
      placeholder={placeholder}
      keyboardType="decimal-pad"
      value={isAmountSelected ? totalInvestment.toString() : quantity.toString()}
      onChangeText={(value) => {
        if (isAmountSelected) {
          setTotalInvestment(Number(value));
          setQuantity(Number(value) / (stockID?.value || 1)); // Mise à jour de la quantité en fonction du montant
        } else {
          setQuantity(Number(value));
          setTotalInvestment(Number(value) * (stockID.value)); // Mise à jour du montant en fonction de la quantité
        }
      }}
      returnKeyType="done"
      onSubmitEditing={() => Keyboard.dismiss()}
    />

    {/* Afficher un message si les fonds sont insuffisants */}
    {totalInvestment + (totalInvestment * gameData.game.fees) / 100 > (userData?.cash || 0) && (
      <Text style={[textStyles.body, { color: colors.red, marginTop: 10 }]}>
        Fonds insuffisants pour réaliser cet achat.
      </Text>
    )}

    <Text
      style={[
        textStyles.body,
        { color: colors.black2, marginVertical: 10 },
      ]}
    >
      Frais
    </Text>
    <Text
      style={[
        textStyles.body,
        { color: colors.red, marginBottom: 10 },
      ]}
    >
      {((isAmountSelected ? totalInvestment : quantity * (stockID?.value || 0)) * gameData.game.fees / 100).toFixed(2)}€ ({gameData.game.fees}%)
    </Text>
    <Text
      style={[
        textStyles.body,
        { color: colors.black2, marginVertical: 10 },
      ]}
    >
      Coût total
    </Text>
    <Text
      style={[
        textStyles.heading2,
        { color: colors.black1, marginBottom: 10 },
      ]}
    >
      {(
        (isAmountSelected ? totalInvestment : quantity * (stockID?.value || 0)) +
        ((isAmountSelected ? totalInvestment : quantity * (stockID?.value || 0)) * gameData.game.fees) / 100
      ).toFixed(2)}€ {/* Coût total avec les frais */}
    </Text>

    <Text
      style={[
        textStyles.body,
        { color: colors.black2, marginVertical: 10 },
      ]}
    >
      Nouveau solde disponible
    </Text>
    <Text
      style={[
        textStyles.heading2,
        { color: colors.black1, marginBottom: 10 },
      ]}
    >
      {(
        userData?.cash -
        (isAmountSelected ? totalInvestment : quantity * (stockID?.value || 0)) -
        ((isAmountSelected ? totalInvestment : quantity * (stockID?.value || 0)) * gameData.game.fees) / 100
      ).toFixed(2)}€ {/* Nouveau solde après achat */}
    </Text>

    <Button
      type="primary"
      title="Confirmer l'achat"
      iconName="checkmark-outline"
      onPress={async () => {
        setReloading(true);
        try {
          const userToken = await AsyncStorage.getItem("userToken");
          if (!userToken) {
            alert("Erreur : Token utilisateur introuvable.");
            return;
          }

          const userCash = userData?.cash || 0;

          if (totalInvestment > userCash) {
            alert(
              "Erreur : Le montant dépasse votre solde disponible."
            );
            return;
          }

          const stockPrice = stockID?.value || 0;
          const purchaseAmount = isAmountSelected ? totalInvestment / stockPrice : quantity;

          const body = {
            name: stockID?.name || "",
            quantity: (isAmountSelected ? totalInvestment / stockID.value : quantity).toString().replace(',', '.'), // Conversion des virgules en points
            game_id: gameData.game.id,
          };
          

          const response = await fetch(
            "https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/transaction/buy",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: userToken,
              },
              body: JSON.stringify(body),
            }
          );

          const data = await response.json();

          if (response.ok) {
            yyySheetRef.current?.close();
            buySheetRef.current?.close();
            setReloading(false);
            alert("Achat effectué avec succès");
            fetchData();
            Keyboard.dismiss();

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
            console.log("response not ok");
          }
        } catch (error) {
          console.log("catch error");
        }
      }}
    />
  </ScrollView>
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
  <ScrollView contentContainerStyle={{ padding: spacings.spacing.medium }}>
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
          {(typeof selectedStockToSell.quantity === 'number' ? selectedStockToSell.quantity.toFixed(10) : "0.00")} actions
        </Text>
        <Text
          style={[
            textStyles.body,
            { color: colors.black1, marginVertical: 10 },
          ]}
        >
          Valeur totale : { selectedStockToSell.amount} €
        </Text>

        {/* Boutons pour sélectionner entre "Montant" et "Quantité" */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ width: "45%" }}>
            <Button
              type={isAmountSelected ? 'primary' : 'secondary'}
              title="Montant"
              iconName="cash-outline"
              onPress={() => {
                setIsAmountSelected(true);
                setPlaceholder('Entrez le montant');
              }}
            />
          </View>
          <View style={{ width: "45%", marginLeft: 10 }}>
            <Button
              type={isAmountSelected ? 'secondary' : 'primary'}
              title="Quantité"
              iconName="layers-outline"
              onPress={() => {
                setIsAmountSelected(false);
                setPlaceholder('Entrez la quantité');
              }}
            />
          </View>
        </View>

        <AmountInput
          placeholder={placeholder}
          keyboardType="numeric"
          value={isAmountSelected ? totalInvestment.toString() : quantity.toString()}
          onChangeText={(value) => {
            if (isAmountSelected) {
              setTotalInvestment(Number(value));
              setQuantity(Number(value) / ((selectedStockToSell.amount / selectedStockToSell.quantity) || 1)); // Mise à jour de la quantité en fonction du montant
            } else {
              setQuantity(Number(value));
              setTotalInvestment(Number(value) * ((selectedStockToSell.amount / selectedStockToSell.quantity) || 0)); // Mise à jour du montant en fonction de la quantité
            }
          }}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()} // Masquer le clavier lorsque l'utilisateur appuie sur "done"
        />

        {/* Afficher un message si la quantité à vendre est supérieure à celle détenue */}
        {quantity > (typeof selectedStockToSell.quantity === 'number' ? selectedStockToSell.quantity : 0) && (
          <Text style={[textStyles.body, { color: colors.red, marginTop: 10 }]}>
            Quantité d'actions insuffisante pour réaliser cette vente.
          </Text>
        )}

        <Text
          style={[
            textStyles.body,
            { color: colors.black2, marginVertical: 10 },
          ]}
        >
          Frais
        </Text>
        <Text
          style={[
            textStyles.body,
            { color: colors.red, marginBottom: 10 },
          ]}
        >
          {((totalInvestment * gameData.game.fees) / 100).toFixed(2)}€ ({gameData.game.fees}%)
        </Text>
        <Text
          style={[
            textStyles.body,
            { color: colors.black2, marginVertical: 10 },
          ]}
        >
          Montant total de la vente
        </Text>
        <Text
          style={[
            textStyles.heading2,
            { color: colors.black1, marginBottom: 10 },
          ]}
        >
          {(totalInvestment + (totalInvestment * gameData.game.fees) / 100).toFixed(2)}€ {/* Montant total après frais */}
        </Text>

        <Button
          type="primary"
          title="Confirmer la vente"
          iconName="checkmark-outline"
          onPress={async () => {
            Keyboard.dismiss(); // Masquer le clavier avant de confirmer la vente
            setReloading(true);
            try {
              const userToken = await AsyncStorage.getItem("userToken");
              if (!userToken) {
                alert("Erreur : Token utilisateur introuvable.");
                return;
              }

              if (quantity > (typeof selectedStockToSell.quantity === 'number' ? selectedStockToSell.quantity : 0)) {
                alert(
                  "Erreur : La quantité demandée dépasse la quantité d'actions détenues."
                );
                return;
              }

              const sellAmount = totalInvestment;

              // Préparer la requête API pour la vente
              const body = {
                name: selectedStockToSell.name, // Nom de l'entreprise
                quantity: quantity.toString().replace(',', '.'), // Quantité à vendre
                game_id: gameData.game.id,
              };

              const response = await fetch(
                "https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/transaction/sell",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: userToken,
                  },
                  body: JSON.stringify(body),
                }
              );

              const data = await response.json();

              if (response.ok) {
                // Succès : fermer la fenêtre, afficher un message de succès, et rafraîchir les données
                sellPageTwoSheetRef.current?.close();
                sellSheetRef.current?.close();
                Keyboard.dismiss(); // Masquer le clavier
                setReloading(false);
                alert("Vente effectuée avec succès");
                
                // Rafraîchir les données sur la page
                fetchData();
              } else {
                // Erreur : afficher un message d'erreur
                alert(`Erreur lors de la vente : ${data.message || "Veuillez réessayer."}`);
              }
            } catch (error) {
              alert("Une erreur est survenue, veuillez réessayer.");
            }
          }}
        />
      </>
    ) : (
      <Text>Aucune action sélectionnée.</Text>
    )}
  </ScrollView>
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
  container2: {
    backgroundColor: colors.grey2,
    opacity: 1, // Garder le fond de base
    borderRadius: spacings.corner.medium,
    padding: spacings.spacing.medium,
    borderWidth: 0,
    width: "100%",
    backgroundImage: 'linear-gradient(rgba(75, 0, 130, 0.3), rgba(255, 255, 255, 0))', 
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
