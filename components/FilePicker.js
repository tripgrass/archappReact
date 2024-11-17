import {useRef} from 'react';
import {Pressable, Text, View} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function FilePicker (props) {
  const { onChange } = props;
  const inputRef = useRef(null);
  const s = require('@/components/style');

  const handleClick = () => {
    inputRef.current.click();
  };



  return (
    <View style={{
       marginLeft: 'auto'
    }}>
      <input
        style={{display: 'none'}}
        ref={inputRef}
        type="file"
        onChange={onChange}
      />
      <Pressable 
        style={({pressed}) => [
                {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            height:40,
            width:40,
            elevation: 3,
            marginLeft: 'auto',                 
            boxShadow: '0px 2px 2px #d8d8d8'                    
                }
        ]}
          onPress={  handleClick }
      >
        <Text style={s.pressPlus}>+</Text>
        <Ionicons name="image-outline" size={30} color="" style={{
              display:'flex-inline',
              height:30,
              width:30,
              borderRadius:16,                
        }}/>
      </Pressable> 
    </View>
  );
};