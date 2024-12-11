import { StyleSheet, View, Platform,Pressable, Text } from 'react-native';
import { Link } from 'expo-router';

const s = require('@/components/style');

type Props = {
	label: string;
	styles?: () => void;
	theme?: 'primary';
	onPress?: () => void;
};

export default function Button(props) {
	const { onPress, title = 'Save', type='', styles, textStyles, webbable=false, url=null } = props;
		var PressClass = s.pressableButton;
		var TextClass = s.pressableButtonText;
	if(  Platform.OS == "web" && webbable ){
		return (
			<Link style={[styles]} href={url}>{title}</Link>
		);
	}
	else{
		return (

				<Pressable 
					style={[PressClass, styles]}
					onPress={onPress}
				>
					<Text style={[TextClass, textStyles]}>{title}</Text>
				</Pressable>
	 	);
	 }
} 