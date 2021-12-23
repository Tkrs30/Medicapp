import React, { useEffect, useState, useLayoutEffect } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getPatients, putPatient, postPatient, delPatient, getChanges, login } from './API/Api.js'
import Storage from './storage/Storage'
import { useForm, Controller } from "react-hook-form";
import { Container, Content, Item, Label, Button, Input, Form } from 'native-base';
import 'moment/locale/fr';
import moment from "moment";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    numberOfLines: 15,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  title: {
    fontSize: 20,
  },
})

function LoginScreen({ navigation }) {
  return (
    <Button
      title="console.log"
      onPress={() =>
        console.log('ca marche bien')
      }
    />
  );

}

function SettingsScreen({ navigation }) {
  const [changes, setChanges] = useState([]);

  React.useLayoutEffect(() => {
    moment.locale('fr')
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => navigation.navigate('Profile')}>
          <Text>Profile</Text>
        </Button>
      ),
    });
  }, [navigation]);

  const Item = ({ changes }) => (
    <TouchableWithoutFeedback>
      <View style={styles.item}>
        <Text style={styles.title}>Le {moment(changes.created_at).format('Do MMMM YYYY à h:mm:ss a')}</Text>
        {JSON.parse(changes.modifications)?.name &&
          <Text>{changes.user.name} a modifier le nom du patient {changes.patients_data.name + ' ' + changes.patients_data.firstname} de {JSON.parse(changes.modifications).name.original} en {JSON.parse(changes.modifications).name.changes}</Text>
        }
        {JSON.parse(changes.modifications)?.firstname &&
          <Text>{changes.user.name} a modifier le prénom du patient du patient {changes.patients_data.name + ' ' + changes.patients_data.firstname} de {JSON.parse(changes.modifications).firstname.original} en {JSON.parse(changes.modifications).firstname.changes}</Text>
        }
        {JSON.parse(changes.modifications)?.birthday &&
          <Text>{changes.user.name} a modifier la date de naissance du patient {changes.patients_data.name + ' ' + changes.patients_data.firstname} de {JSON.parse(changes.modifications).birthday.original} en {JSON.parse(changes.modifications).birthday.changes}</Text>
        }
      </View>
    </TouchableWithoutFeedback>
  );

  const renderItem = ({ item }) => (
    <Item changes={item} />
  );

  useFocusEffect(
    React.useCallback(() => {
      getChanges().then(data => {
        setChanges(data);
      }).catch(err => {
        console.log(err)
      })
      return () => {
      };
    }, []),
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.title}>Dernieres Modifications Patients</Text>
      <FlatList
        data={changes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>

      <Button onPress={() => navigation.goBack()}>
        <Text>Retour</Text>
      </Button>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const [patients, setPatients] = useState([]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => navigation.navigate('Modifier/Créer un Patient')}>
          <Text>Nouveau patient</Text>
        </Button>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      getPatients().then(data => {
        setPatients(data);
      }).catch(err => {
        console.log(err)
      })
      return () => {
      };
    }, [])
  );

  const Item = ({ patient }) => (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Modifier/Créer un Patient', { patient })}>
      <View style={styles.item}>
        <Text style={styles.title}>{patient.firstname + ' ' + patient.name}</Text>
        <Text>Date de naissance : {moment(patient.birthday).format("DD/MM/YYYY")}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderItem = ({ item }) => (
    <Item patient={item} />
  );

  useEffect(() => {
    getPatients().then(data => {
      setPatients(data);
    }).catch(err => {
      console.log(err)
    })
    return () => null;
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        style={{
          height: 1,
          width: "73.5%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
        data={patients}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { handleSubmit, control } = useForm({ defaultValues: route.params?.patient || null });

  useEffect(() => {
  })

  const deletered = (data) => {
    delPatient({ ...{}, args: [data.id] })
      .then(() => {
        navigation.goBack()
      }).catch((err) => {

      })
  }

  const redirect = (data) => {
    console.log(data)
    if (route.params?.patient != null) {
      putPatient({ ...data, args: [data.id] })
        .then(() => {
          navigation.goBack()
        }).catch((err) => {

        })
    } else {
      postPatient(data)
        .then(() => {
          navigation.goBack()
        }).catch((err) => {

        })
    }
  }

  return (
    <View style={styles.container}>
      <Form>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Item stackedLabel>
              <Label>Nom</Label>
              <Input
                value={value}
                keyboardType="default"
                autoCapitalize="words"
                autoCorrect={true}
                autoFocus={true}
                onChangeText={(text) => onChange(text)}
              />
            </Item>
          )}
        />
        <Controller
          control={control}
          name="firstname"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Item stackedLabel>
              <Label>Prenom</Label>
              <Input
                value={value}
                keyboardType="default"
                autoCapitalize="words"
                autoCorrect={true}
                autoFocus={true}
                onChangeText={(text) => onChange(text)}
              />
            </Item>
          )}
        />
        <Controller
          control={control}
          name="birthday"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Item stackedLabel>
              <Label>Date de naissance</Label>
              <Input
                value={value}
                keyboardType="default"
                autoCapitalize="words"
                autoCorrect={true}
                autoFocus={true}
                onChangeText={(text) => onChange(text)}
              />
            </Item>
          )}
        />
      </Form>
      <Button block onPress={handleSubmit(redirect)}>
        <Text>OK</Text>
      </Button>
      <Text>
        {"\n"}
      </Text>
      {route.params?.patient
        ? <Button color="#841584" onPress={handleSubmit(deletered)}>
          <Text>Supprimer</Text>
        </Button>
        : null}
    </View>
  );
}

const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const token = 'Bearer 2|SqEdapWNRDZY6SnNX8Dt59nsZiALnciBA4b54hKv';

export default function App() {
  const [isconnected, setIsconnected] = useState(Storage.getItem('@token') ? false : true);
  const { handleSubmit, control } = useForm({ defaultValues: null });

  const redirect = (data) => {
    console.log('ici', data)
    login(data)
      .then((data) => {
        Storage.setItem('@token', data.token)
        var token = null
        console.log(token, Storage.getItem('@token'))
        setIsconnected(false)
      }).catch((err) => {
        console.log('ouais', err)
      })
  }

  const Item2 = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion{"\n"}</Text>
      <Form>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Item stackedLabel>
              <Label>Adresse Mail</Label>
              <Input
                //value={'tnb.golden30@gmail.com'}
                value={value}
                keyboardType="default"
                autoCapitalize="words"
                autoCorrect={true}
                autoFocus={true}
                onChangeText={(text) => onChange(text)}
              />
            </Item>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Item stackedLabel>
              <Label>Mot de passe</Label>
              <Input
                //value={'12345678'}
                value={value}
                keyboardType="default"
                autoCapitalize="words"
                autoCorrect={true}
                autoFocus={true}
                onChangeText={(text) => onChange(text)}
              />
            </Item>
          )}
        />
      </Form>
      <Button block onPress={handleSubmit(redirect)}>
        <Text>OK</Text>
      </Button>
    </View>
  );

  if (!isconnected) {
    return <Item2 />
  }

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="First">
          {() => (
            <SettingsStack.Navigator>
              <SettingsStack.Screen
                name="Modifications"
                component={SettingsScreen}
              />
              <SettingsStack.Screen
                name="Profile"
                component={ProfileScreen}
              />
            </SettingsStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="Patients">
          {() => (
            <HomeStack.Navigator>
              <HomeStack.Screen
                name="Liste Patients"
                component={HomeScreen} />
              <HomeStack.Screen
                name="Modifier/Créer un Patient"
                component={DetailsScreen}
              />
            </HomeStack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  )
}
