import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Motivational messages for screen time alerts
const IMPULSE_MESSAGES = [
  {
    title: 'Ei, e se investisses esse tempo em ti?',
    body: 'Que tal 5 min de meditacao? O teu eu do futuro agradece.',
  },
  {
    title: 'Ja scrollaste o suficiente 📱',
    body: '10 minutos de leitura valem mais que 10 minutos de scroll.',
  },
  {
    title: 'Pausa para crescer 🌱',
    body: 'Uma atividade rapida pode mudar o teu dia. Bora?',
  },
  {
    title: 'O teu streak esta a espera!',
    body: 'Nao quebres a sequencia. Uma atividade e suficiente.',
  },
  {
    title: 'Momento IMPULSO 🚀',
    body: 'Troca 15 min de redes por 15 min de evolucao. Vale a pena.',
  },
  {
    title: 'Nao perdeste o dia',
    body: 'Ainda ha tempo para fazer algo que importa. Abre o IMPULSO.',
  },
  {
    title: 'O scroll nao te leva a lado nenhum',
    body: 'Mas 10 min de journaling podem mudar a tua perspetiva.',
  },
  {
    title: 'Hora de treinar a mente 🧠',
    body: 'Uma atividade de aprendizagem esta a tua espera.',
  },
];

function getRandomMessage() {
  return IMPULSE_MESSAGES[Math.floor(Math.random() * IMPULSE_MESSAGES.length)];
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('impulso', {
      name: 'IMPULSO',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#22c55e',
    });
  }

  return true;
}

// Schedule daily reminder notifications
export async function scheduleDailyReminders() {
  // Cancel existing scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Morning reminder (9:00)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Bom dia! Como vais investir em ti hoje?',
      body: 'Abre o IMPULSO e comeca o dia com uma atividade de crescimento.',
      data: { type: 'morning_reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });

  // Afternoon check-in (14:00)
  await Notifications.scheduleNotificationAsync({
    content: {
      ...getRandomMessage(),
      data: { type: 'afternoon_checkin' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 14,
      minute: 0,
    },
  });

  // Evening reminder (20:00)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Antes de dormir...',
      body: 'Que tal 5 min de journaling para encerrar o dia com clareza?',
      data: { type: 'evening_reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

// Send an immediate nudge (used when screen time threshold is hit)
export async function sendScreenTimeNudge() {
  const msg = getRandomMessage();
  await Notifications.scheduleNotificationAsync({
    content: {
      ...msg,
      data: { type: 'screen_time_nudge' },
    },
    trigger: null, // immediate
  });
}

// Cancel all notifications (when user disables)
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
