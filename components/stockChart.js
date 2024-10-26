import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
import { G, Rect, Svg, Text as SvgText, Line } from 'react-native-svg';
import * as scale from 'd3-scale';
import { max, min } from 'd3-array';
import configColors from '../config-colors';

// Fonction de génération aléatoire avec seed
function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Fonction pour générer des données boursières avec variations
const generateStockData = (points = 30, seed = 1) => {
  const data = [];
  let lastPrice = 1000;

  for (let i = 0; i < points; i++) {
    const changePercent = (seededRandom(seed + i) * 10 - 5) / 100;
    const open = lastPrice;
    const close = open + open * changePercent;
    const high = Math.max(open, close) + seededRandom(seed + i + 1) * 5;
    const low = Math.min(open, close) - seededRandom(seed + i + 2) * 5;

    data.push({
      open: parseFloat(open.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
    });
    lastPrice = close;
  }
  return data;
};

// Composant graphique en chandeliers
const CandlestickChart = () => {
  const [duration, setDuration] = useState('Jour');
  const [touchX, setTouchX] = useState(null);
  const [touchY, setTouchY] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const durations = {
    Heure: 30, // 30 points pour l'heure (1 point toutes les 2 minutes)
    Jour: 48,
    Semaine: 28,
    Mois: 30,
    Année: 52,
  };

  // Génération des données simulées en fonction de la durée
  const stockData = generateStockData(durations[duration]);

  // Dimensions du graphique
  const width = Dimensions.get('window').width - 30;
  const height = 250;
  const padding = 30;
  const availableWidth = width - 2 * padding;
  const candleWidth = Math.min(availableWidth / stockData.length - 3, 10);

  // Échelle des données
  const xScale = scale.scaleLinear()
    .domain([0, stockData.length - 1])
    .range([padding, width - padding]);

  const yScale = scale.scaleLinear()
    .domain([min(stockData, d => d.low), max(stockData, d => d.high)])
    .range([height - padding, padding]);

  // Fonction pour dessiner les chandeliers
  const renderCandlesticks = () => {
    return stockData.map((d, index) => {
      const x = xScale(index);
      const candleX = x - candleWidth / 2;
      const candleColor = d.close > d.open ? configColors.green : configColors.red;
      const candleHeight = Math.abs(yScale(d.open) - yScale(d.close));

      return (
        <G key={index}>
          <Rect
            x={candleX}
            y={Math.min(yScale(d.open), yScale(d.close))}
            width={candleWidth}
            height={candleHeight === 0 ? 1 : candleHeight}
            fill={candleColor}
          />
        </G>
      );
    });
  };

  // Fonction pour dessiner les repères des axes X et Y
  const renderAxes = () => {
    const xTicks = stockData.map((_, i) => i).filter((_, i) => {
      if (duration === 'Heure') return i % 4 === 0; // Un repère toutes les 10 minutes pour "Heure"
      if (duration === 'Jour') return i % 4 === 0; // Un repère toutes les 4 heures pour "Jour"
      if (duration === 'Année') return i % 8 === 0; // Un repère toutes les 4 années pour "Année"
      return i % 2 === 0; // Autres durées
    });    
    const yTicks = yScale.ticks(5);
    const xLabels = duration === 'Heure' ? Array.from({ length: stockData.length }, (_, i) => `${2 * i}m`) :
                    duration === 'Jour' ? Array.from({ length: stockData.length }, (_, i) => `${i}h`) :
                    duration === 'Semaine' ? ['L', 'M', 'M', 'J', 'V', 'S', 'D'] :
                    duration === 'Mois' ? ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] :
                    duration === 'Année' ? Array.from({ length: stockData.length }, (_, i) => `${2024 - i}`) : [];

    return (
      <G>
        {/* Axe X */}
        {xTicks.map((tick, i) => (
          <SvgText
            key={`x-${i}`}
            x={xScale(tick)}
            y={height - padding / 2}
            fontSize="10"
            textAnchor="middle"
            fill="black"
          >
            {xLabels[tick % xLabels.length]}
          </SvgText>
        ))}

        {/* Axe Y */}
        {yTicks.map((tick, i) => (
          <SvgText
            key={`y-${i}`}
            x={padding / 2}
            y={yScale(tick)}
            fontSize="10"
            textAnchor="middle"
            fill="black"
          >
            {tick.toFixed(2)}
          </SvgText>
        ))}
      </G>
    );
  };

  // Fonction pour dessiner les lignes en pointillé en fonction de la durée
  const renderDashedLines = () => {
    let numLines;
    if (duration === 'Heure') numLines = 12;
    else if (duration === 'Jour') numLines = 48;
    else if (duration === 'Semaine') numLines = 28;
    else if (duration === 'Mois') numLines = 30;
    else if (duration === 'Année') numLines = 52;

    return Array.from({ length: numLines }).map((_, i) => {
      if (i % 4 === 0) {
        const x = padding + (i + 1) * ((width - 2 * padding) / (numLines + 1));
        return (
          <Line
            key={`dashed-${i}`}
            x1={x}
            x2={x}
            y1={padding}
            y2={height - padding}
            stroke={configColors.grey3}
            strokeDasharray="5, 5"
          />
        );
      }
      return null;
    });
  };

  // Gestion du clic sur le graphique
  const handlePressIn = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const closestIndex = Math.round(xScale.invert(locationX));
    const closestData = stockData[closestIndex];

    setTouchX(locationX);
    setTouchY(locationY);
    setSelectedData(closestData);
    setShowModal(true);
  };

  const handlePressOut = () => {
    setTouchX(null);
    setTouchY(null);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {renderCandlesticks()}
        {renderAxes()}
        {renderDashedLines()}

        {/* Lignes en pointillé sur X et Y */}
        {touchX && touchY && (
          <>
            <Line
              x1={touchX}
              x2={touchX}
              y1={padding}
              y2={height - padding}
              stroke={configColors.grey5}
              strokeDasharray="0"
            />
          </>
        )}
      </Svg>

      {showModal && selectedData && (
        <Modal transparent={true} visible={showModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>{selectedData.close} €</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.buttonContainer}>
        {Object.keys(durations).map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.button, duration === key && styles.selectedButton]}
            onPress={() => setDuration(key)}
          >
            <Text style={styles.buttonText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  button: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: configColors.grey3,
    borderRadius: 10,
    marginRight: 8,
  },
  selectedButton: {
    backgroundColor: configColors.indigo,
  },
  buttonText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: configColors.grey2,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
  },
});

export default CandlestickChart;
