import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	Image,
	TouchableOpacity
} from 'react-native'
import { ArrowLeft } from 'phosphor-react-native'
import { captureScreen } from 'react-native-view-shot'
import * as FileSystem from 'expo-file-system'

import { theme } from '../../theme'

import { styles } from './styles'
import { feedbackTypes } from '../../utils/feedbackTypes'
import { FeedbackType } from '../Widget/Widget'
import ScreenshotButton from '../ScreenshotButton'
import Button from '../Button'
import { api } from '../../libs/api'


interface Props {
	feedbackType: FeedbackType
	onFeedbackCanceled: () => void
	onFeedbackSent: () => void
}

const Form = ({ feedbackType, onFeedbackCanceled, onFeedbackSent }: Props) => {
	const [isSendingFeedback, setIsSendingFeedback] = useState(false)
	const [screenshot, setScreenshot] = useState<string | null>(null)
	const [comment, setComment] = useState('')

	const feedbackTypeInfo = feedbackTypes[feedbackType]

	const handleScreenshot = () => {
		captureScreen({
			format: 'jpg',
			quality: 0.8
		}).then(uri => setScreenshot(uri))
			.catch(error => console.log(error))
	}

	const handleScreenshotRemove = (): void => {
		setScreenshot(null)
	}

	const handleSendFeedback = async (): Promise<void> => {
		if (isSendingFeedback) return

		setIsSendingFeedback(true)

		const screenshotBase64 =
			screenshot &&
			await FileSystem.readAsStringAsync(screenshot, { encoding: 'base64' })

		try {
			await api.post('/feedbacks', {
				type: feedbackType,
				screenshot: `data:image/png;base64, ${screenshotBase64}`,
				comment
			})

			onFeedbackSent()
		}catch(error) {
			console.log(error)
			setIsSendingFeedback(false)
		}
	}

	return (
		<View style={styles.container}>

			<View style={styles.header}>
				<TouchableOpacity onPress={onFeedbackCanceled}>
					<ArrowLeft
						size={24}
						weight="bold"
						color={theme.colors.text_secondary}
					/>
				</TouchableOpacity>
				<View style={styles.titleContainer}>
					<Image source={feedbackTypeInfo.image} style={styles.image} />
					<Text style={styles.titleText}>
						{feedbackTypeInfo.title}
					</Text>
				</View>
			</View>

			<TextInput
				multiline
				style={styles.input}
				placeholder='Algo não está funcionando bem? Queremos corrigir. Conte com mais detalhes o que está acontecendo'
				placeholderTextColor={theme.colors.text_secondary}
				autoCorrect={false}
				onChangeText={setComment}
			/>
			<View style={styles.footer}>
				<ScreenshotButton
					screenshot={screenshot}
					onRemoveShot={handleScreenshotRemove}
					onTakeShot={handleScreenshot}
				/>
				<Button isLoading={isSendingFeedback} onPress={handleSendFeedback} />
			</View>
		</View>
	)
}

export default Form
