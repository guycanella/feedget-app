import React from 'react'
import { View, Text } from 'react-native'
import { feedbackTypes } from '../../utils/feedbackTypes'

import type { FeedbackType } from '../Widget/Widget'

import Copyright from '../Copyright'
import Option from '../Option'

import { styles } from './styles'

interface Props {
	onFeedbackTypeChanged: (feedbackType: FeedbackType) => void
}

const Options = ({ onFeedbackTypeChanged }: Props) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Deixe seu feedback
			</Text>
			<View style={styles.options}>
				{Object
					.entries(feedbackTypes)
					.map(([key, value]) => {
						return (
							<Option
								key={key}
								title={value.title}
								image={value.image}
								onPress={() => onFeedbackTypeChanged(key as FeedbackType)}
							/>
						)
					})
				}
			</View>
			<Copyright />
		</View>
	)
}

export default Options
