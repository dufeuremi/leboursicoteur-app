import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Image, View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
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

export default function Game() {
  const [refreshing, setRefreshing] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [stockID, setStockID] = useState("");

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
    // Définir un intervalle pour rafraîchir les données toutes les 2 secondes
    const interval = setInterval(() => {
      fetchData(); // Appeler fetchData pour actualiser les données
    }, 8000);
  
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: configColors.grey1,
          translateY: -200,
        }}
      >
        <Image
          source={require("../assets/adaptive-icon.png")}
          style={{ width: 50, height: 50 }}
        />
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
user.rank = `${index + 1}ème`;
});


const marketData = gameData.users_data[0].wallet.data.map((stock, index) => {
  // Trouver la valeur actuelle de l'action dans gameData.stock
  const currentStock = gameData.stock.find((s) => s.name === stock.name);
  const stockPrice = currentStock ? currentStock.value : 0; // Utiliser 0 si la valeur n'est pas trouvée

  return {
    icon: require("../assets/adaptive-icon.png"),
    name: stock.name,
    value: `${stock.name} / ${stock.quantity.toFixed(2)}`,
    percentageChange: "↗ 0%", // À ajuster selon la logique de votre application
    amount: `${(stock.quantity * stockPrice).toFixed(2)} €`, // Utiliser le prix réel ici
  };
});
  
  const userRank = sortedRankData.findIndex((user) => user.userId === gameData.user_id) + 1;
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
          <InfoBanner
            iconType="time"
            text={`Clôture dans ${formatTime(timeRemaining)}`}
            style={{ flex: 1, paddingHorizontal: spacings.spacing.large }}
          />
          <Text style={[textStyles.heading1, { marginVertical: 15 }]}>
            Classement
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
          <View style={styles.container}>
            <View>
            {sortedRankData.map((user, index) => (
  <RankItem
    key={index}
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



<View  style={{ marginTop: 20 }}>
              <Button
               
                type="secondary"
                title="Voir le classement"
                iconName="arrow-forward"
                onPress={() => bottomSheetRef.current?.snapToIndex(1)}
              /></View>
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
              <Text
                style={[
                  textStyles.heading2,
                  { color: colors.indigo, marginLeft: 10, fontSize: 18 },
                ]}
              >
                ↗ 1.2%
              </Text>
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
              key={index}
              onPress={() => {
                setStockID(market);
                marketSheetRef.current?.snapToIndex(0);
              }}
              
            >
              <MarketBadge
                icon={market.icon}
                value={market.value}
                percentageChange={market.percentageChange}
                amount={market.amount}
                extraInfo={market.extraInfo}
                name={market.name}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollableContent}>
          <Text style={styles.textContent}>Votre contenu scrollable ici</Text>
        </ScrollView>
        <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={styles.scrollableContent}>
            <Text style={styles.textContent}>Votre contenu scrollable ici</Text>
          </ScrollView>
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
                  key={index}
                  user={{
                    avatar: "../assets/adaptive-icon.png",
                    name: user.name,
                    rank: user.rank,
                    points: "N/A",
                    amount: `${user.portfolioValue} `,
                    change: "N/A",
                  }}
                />
              ))}
          {/*<RankItem key={index} user={gameData.user[0]} />*/}
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
              <Text
                style={[
                  textStyles.heading2,
                  { color: colors.indigo, marginLeft: 10, fontSize: 18 },
                ]}
              >
                ↗ 1.2%
              </Text>
            </View>
        </View>
      </BottomSheet>
      {/* Detail action*/}
      <BottomSheet
        ref={marketSheetRef}
        index={-1} // Par défaut, Bottom Sheet est cachée
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, marketSheetRef)}
      >
        <View style={styles.bottomSheet}>
          <Text style={[textStyles.body, { color: colors.black2 }]}> {stockID.value}</Text>

          <Text style={textStyles.heading1}>{stockID.amount} € </Text>
          <Text
            style={[
              textStyles.heading2,
              { color: colors.indigo, fontSize: 18 },
            ]}
          >
             {stockID.percentageChange}
          </Text>
        </View>


      </BottomSheet>







      
      {/* Achat partie 1*/}
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
              Selectionner une position
            </Text>
            <SearchBar placeholder="Search..." />

            {marketData.map((market, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => xxxSheetRef.current?.snapToIndex(0)}
              >
                <MarketBadge
                  icon={market.icon}
                  value={market.value}
                  percentageChange={market.percentageChange}
                  amount={market.amount}
                  extraInfo={market.extraInfo}
                  name={market.name}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>
      {/* Achat partie 2*/}
      <BottomSheet
        ref={xxxSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, xxxSheetRef)}
      >
        <View >
          <Text style={textStyles.heading1}>BSC</Text>
          <Text style={[textStyles.body, { color: colors.black2 }]}>
            Cours de l'action
          </Text>
          <View style={styles.walletContainer}>
            <Ionicons
              name="logo-euro"
              size={24}
              color={colors.black1}
              style={styles.icon}
            />
            <Text style={[textStyles.heading2, { marginVertical: 15 }]}>
              18290,82
            </Text>
            <Text
              style={[
                textStyles.heading2,
                { color: colors.indigo, marginLeft: 10, fontSize: 18 },
              ]}
            >
              ↗ 1.2%
            </Text>
          </View>

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
      {/* Achat partie 3*/}
      <BottomSheet
        ref={yyySheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, yyySheetRef)}
      >
        <View style={styles.bottomSheet}>
          <Text style={textStyles.heading1}>Montant à investir</Text>
          <InfoBanner
            text="Le boursicoteur est une simulation, aucun prevelement réél sera effectué."
            iconType="info"
          />
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
            28,82 €
          </Text>
          <AmountInput
            placeholder="Montant"
            keyboard="digits"
            capitalize="yes"
          />

          <Button
            type="primary"
            title="Confirmer l'achat"
            iconName="checkmark-outline"
            onPress={() => {
              yyySheetRef.current?.close();
              xxxSheetRef.current?.close();
              buySheetRef.current?.close();
            }}
          />
        </View>
      </BottomSheet>
      {/* Vente partie 1*/}
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
              Selectionner une position
            </Text>

            {marketData.map((market, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => sellPageOneSheetRef.current?.snapToIndex(0)}
              >
                <MarketBadge
                  icon={market.icon}
                  value={market.value}
                  percentageChange={market.percentageChange}
                  amount={market.amount}
                  extraInfo={market.extraInfo}
                  
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>
      {/* Vente partie 2*/}
      <BottomSheet
        ref={sellPageOneSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, xxxSheetRef)}
      >
        <View style={styles.bottomSheet}>
          <Text style={textStyles.heading1}>BSC</Text>
          <Text style={[textStyles.body, { color: colors.black2 }]}>
            Evolution depuis l'achat
          </Text>
          <View style={styles.walletContainer}>
            <Ionicons
              name="logo-euro"
              size={24}
              color={colors.black1}
              style={styles.icon}
            />
            <Text style={[textStyles.heading2, { marginVertical: 15 }]}>
              18290,82
            </Text>
            <Text
              style={[
                textStyles.heading2,
                { color: colors.indigo, marginLeft: 10, fontSize: 18 },
              ]}
            >
              ↗ 1.2%
            </Text>
          </View>

          <Button
            type="primary"
            iconName="logo-euro"
            title="Vendre "
            onPress={() => {
              sellPageTwoSheetRef.current?.snapToIndex(0);
              sellPageOneSheetRef.current?.close();
            }}
          />
        </View>
      </BottomSheet>
      {/* Detail autre utilisateur*/}
      <BottomSheet
        ref={sellPageTwoSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, yyySheetRef)}
      >
        <View style={styles.bottomSheet}>
          <Text style={textStyles.heading1}>Montant à céder</Text>
          <Text
            style={[textStyles.body, { color: colors.black2, marginTop: 30 }]}
          >
            Total action BSC détenues
          </Text>
          <Text
            style={[
              textStyles.heading2,
              { color: colors.black1, marginVertical: 10 },
            ]}
          >
            28,82 € / 1.823882388
          </Text>

          <AmountInput
            placeholder="Montant"
            keyboard="digits"
            capitalize="yes"
          />

          <Button
            type="primary"
            title="Confirmer la vente"
            iconName="checkmark-outline"
            onPress={() => {
              sellPageTwoSheetRef.current?.close();
              sellPageOneSheetRef.current?.close();
              sellSheetRef.current?.close();
            }}
          />
        </View>
      </BottomSheet>
      {/* Portefeuille*/}
      <BottomSheet
        ref={userEvolution}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => handleSheetChanges(index, yyySheetRef)}
      >
        <View style={styles.bottomSheet}>
          <Text style={textStyles.heading1}>André Pierre</Text>
          <Text
            style={[
              textStyles.heading2,
              { color: colors.black2, marginTop: 0 },
            ]}
          >
            29ème
          </Text>
          <Text
            style={[textStyles.body, { color: colors.black2, marginTop: 30 }]}
          >
            Valeur du portefeuille
          </Text>
          <View style={styles.walletContainer}>
            <Ionicons
              name="logo-euro"
              size={24}
              color={colors.black1}
              style={styles.icon}
            />
            <Text style={[textStyles.heading2, { marginVertical: 15 }]}>
              18290,82
            </Text>
            <Text
              style={[
                textStyles.heading2,
                { color: colors.indigo, marginLeft: 10, fontSize: 18 },
              ]}
            >
              ↗ 1.2%
            </Text>
          </View>
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