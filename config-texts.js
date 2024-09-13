// textStyles.js
import { StyleSheet } from 'react-native';
import colors from './config-colors'; 
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';

const textStyles = StyleSheet.create({
  heading1: {
    fontSize: 27,
    fontWeight:  "600",
    color: colors.black1,
    marginVertical: 10,
    marginTop: 35,
    fontFamily: 'Shippori Antique B1',
  },
  heading2: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.black1,
    fontFamily: 'Shippori Antique B1',
  },
  body: {
    fontSize: 18,
    fontWeight: 'normal',
    color: colors.black2,
    fontFamily: 'Shippori Antique B1',
  },
  bold: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black1,
    fontFamily: 'Shippori Antique B1',
  },
  link: {
    fontSize: 18,
    fontWeight: 'normal',
    color: colors.indigo,
    textDecorationLine: 'underline',
    fontFamily: 'Shippori Antique B1',
  },
});

export default textStyles;
