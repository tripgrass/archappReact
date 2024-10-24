import { StyleSheet, View, Pressable, Text } from 'react-native';
const s = require('@/components/style');

type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
};

export default function Button(props) {
  const { onPress, title = 'Save', type='' } = props;
  if('action' == type){
    var PressClass = s.pressableButtonAction;
    var TextClass = s.pressableButtonActionText;    
  }
  else{
    var PressClass = s.pressableButton;
    var TextClass = s.pressableButtonText;
  }
  return (
      <Pressable 
      style={PressClass}
    onPress={onPress}
  >
      <Text style={TextClass}>{title}</Text>
      </Pressable>
 );
} 