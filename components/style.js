'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        padding: 1,
        color:'white'
    }, 
    form: {
        backgroundColor: 'blue',    
        position:'absolute',
        top: '50%'        
    },
    alwaysred: {
        backgroundColor: 'red',
        height: 100,
        width: 100,
    },
    link:{
        margin:20,
        fontSize:24
    },
    button: {
        marginTop:10,
        color:'white',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'blue',
    },    

});