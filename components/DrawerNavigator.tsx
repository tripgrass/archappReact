import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'

const DrawerNavigator = () => {

const Drawer = createDrawerNavigator()

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={EmptyScreen} />
      <Stack.Screen name="Settings" component={EmptyScreen} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator