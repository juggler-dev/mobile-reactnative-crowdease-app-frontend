import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  Switch,
  Platform,
  PermissionsAndroid,
  Alert,
  TextInput
} from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import { GeoPositionState } from 'types/geoPositionState'
import { getPostalCodeCoordinates } from '../services/postalCodeApi'
import { AuthStackNavigationProps } from '../types/types'
import { isPostalCodeValid } from '../utils/postalCode'

const LocationScreen = ({ navigation }: AuthStackNavigationProps<'LocationScreen'>) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [postalCode, setPostalCode] = useState('')
  const [location, setLocation] = useState<GeoPositionState>({
    latitude: null,
    longitude: null,
    error: null
  })

  const getLocation = async () => {
    if (signUpValidation()) {
      if (isEnabled) {
        navigation.navigate('BottomTabs')
      } else if (isPostalCodeValid(postalCode)) {
        try {
          let results = await getPostalCodeCoordinates(postalCode)
          setLocation({
            latitude: results?.latt,
            longitude: results?.longt,
            error: null
          })
        } catch (error) {
          Alert.alert('Error', `${error}`)
        }
        navigation.navigate('BottomTabs')
      } else {
        Alert.alert('Error', 'Enter a valid Postal Code to proceed')
      }
    }
  }

  const signUpValidation = (): boolean => {
    return true
  }

  const toggleSwitchPress = async () => {
    setIsEnabled(previousState => !previousState)
    await requestPermissions()
  }

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse')
      if (auth === 'granted') {
        await getGeolocationCoordinates()
      } else {
        Alert.alert(
          'Error',
          'Location permission Denied. Enter Location or provide permission in settings'
        )
      }
    }

    if (Platform.OS === 'android') {
      if (await requestLocationPermissionAndroid()) {
        await getGeolocationCoordinates()
      } else {
        Alert.alert(
          'Error',
          'Location permission Denied. Enter Location or provide permission in settings'
        )
      }
    }
  }

  const setPostalCodeText = (inputText: string) => {
    const filteredText = inputText.replace(/[\s-]+/g, '')
    setPostalCode(filteredText)
  }

  const requestLocationPermissionAndroid = async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      )
      if (granted === 'granted') {
        return true
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  }

  const getGeolocationCoordinates = async () => {
    return Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        })
      },
      error => {
        Alert.alert('Error', `${error.message}`)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )
  }

  return (
    <View style={styles.wrapper}>
      <Text>CrowdEase works best with location permission </Text>
      <Text>
        Location is used to improve your experience by detecting events and crowds around you.
      </Text>
      <View style={styles.outerTopContainer}>
        <Text style={styles.container}>Turn on GPS</Text>
        <View style={styles.container}>
          <Switch
            hitSlop={{ top: 20, left: 1, right: 1, bottom: 20 }}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchPress}
            value={isEnabled}
          />
        </View>
      </View>
      <View style={styles.outerBottomContainer}>
        <View style={styles.dottedLine}>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black', margin: 20 }} />
          <View>
            <Text style={{ width: 50, textAlign: 'center' }}>Or</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black', margin: 20 }} />
        </View>
        <View>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={setPostalCodeText}
            value={postalCode}
            placeholder="Enter Postal Code Manually"
          />
        </View>
      </View>
      <View style={styles.buttonStyle}>
        <Button onPress={getLocation} title="Get Location" accessibilityLabel="Get Location" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    margin: 20
  },
  buttonStyle: {
    height: 40,
    width: 333,
    margin: 20,
    borderWidth: 1,
    padding: 2
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 5,
    margin: 5
  },
  outerTopContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 2,
    width: '100%',
    height: '30%',
    margin: 5
  },
  outerBottomContainer: {
    flex: 1,
    alignItems: 'center',
    paddingtop: 2,
    width: '100%',
    height: '30%',
    margintop: 20
  },
  dottedLine: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 2,
    width: '100%',
    height: '50%',
    margin: 5
  },
  textInputStyle: {
    height: 40,
    width: 333,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'lightgrey'
  },
  iconStyle: {
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default LocationScreen;
