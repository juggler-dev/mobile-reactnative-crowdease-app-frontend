import { Image, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MapScreen from '../../screens/MapScreen';
import EventScreen from '../../screens/EventScreen';
import WeekManager from '../../screens/WeekManagerScreen';
import { HomeStack } from "../../App";
import { colors } from '../../styles/colors';
import { fontFamily, fontWeightSubtitle2, fontSize } from '../../styles/fonts';
import GradientText from '../GradientText';

const Tab = createBottomTabNavigator();

const NavigationBottomTab = () => {
 
  return (
    <Tab.Navigator initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: colors.netural.surfaceBlack, height: 60, borderTopWidth: 2, borderTopColor: colors.netural.outlineGrey, },
        tabBarActiveTintColor: colors.primary.primaryPurpleDark,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused, }) => (
            <View style={styles.iconContainer}>
              <Image source={focused ? require('../../assets/icons/navIcons/HomeActive.png') : require('../../assets/icons/navIcons/Home.png')} />
              {focused ?
                <GradientText
                  text={'Home'}
                /> :
                <Text style={[styles.label, styles.inactiveLabel]}>Home</Text>}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused, }) => (
            <View style={styles.iconContainer}>
            <Image source={focused ? require('../../assets/icons/navIcons/MapActive.png') : require('../../assets/icons/navIcons/Map.png')} />
            {focused ?
              <GradientText
                text={'Map'}
              /> :
              <Text style={[styles.label, styles.inactiveLabel]}>Map</Text>}
          </View>          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={WeekManager}
        options={{
          tabBarIcon: ({ focused, }) => (
            <View style={styles.iconContainer}>
            <Image source={focused ? require('../../assets/icons/navIcons/ReportActive.png') : require('../../assets/icons/navIcons/Report.png')} />
            {focused ?
              <GradientText
                text={'Report'}
              /> :
              <Text style={[styles.label, styles.inactiveLabel]}>Report</Text>}
          </View>
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventScreen}
        options={{
          tabBarIcon: ({ focused, }) => (
            <View style={styles.iconContainer}>
            <Image source={focused ? require('../../assets/icons/navIcons/EventActive.png') : require('../../assets/icons/navIcons/Event.png')} />
            {focused ?
              <GradientText
                text={'Events'}
               /> :
              <Text style={[styles.label, styles.inactiveLabel]}>Events</Text>}
          </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: colors.netural.surfaceBlack,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 13,
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: fontWeightSubtitle2,
  },
  inactiveLabel: {
    color: colors.netural.surfaceWhite,
  },
});

export default NavigationBottomTab;
