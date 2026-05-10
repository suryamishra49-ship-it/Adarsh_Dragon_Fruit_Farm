import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.logoText}>Dragon<Text style={styles.logoAccent}>Solar</Text></Text>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.title}>Master the Art of</Text>
          <Text style={styles.titleGradient}>Dragon Fruit Farming</Text>
          <Text style={styles.subtitle}>
            From soil preparation to harvest, leverage AI-driven insights and a community marketplace.
          </Text>

          <TouchableOpacity style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>Start Farming Guide</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>Explore Marketplace</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Everything You Need</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🌱</Text>
            <Text style={styles.featureTitle}>Step-by-Step Guide</Text>
            <Text style={styles.featureDesc}>Interactive modules guiding you through soil prep, trellising, pruning, and harvesting.</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📸</Text>
            <Text style={styles.featureTitle}>AI Disease Scanner</Text>
            <Text style={styles.featureDesc}>Upload a photo of your dragon fruit or leaves. Our Gemini AI instantly detects diseases.</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🛒</Text>
            <Text style={styles.featureTitle}>Farmer's Marketplace</Text>
            <Text style={styles.featureDesc}>Buy high-quality cuttings or sell your premium harvest directly to buyers.</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c13',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logoAccent: {
    color: '#D32F6A',
  },
  heroSection: {
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 40,
  },
  titleGradient: {
    fontSize: 36,
    fontWeight: '800',
    color: '#D32F6A',
    lineHeight: 40,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#a19ba8',
    marginBottom: 30,
    lineHeight: 24,
  },
  btnPrimary: {
    backgroundColor: '#D32F6A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  btnSecondaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: '#1c1624',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  featureDesc: {
    color: '#a19ba8',
    lineHeight: 22,
  },
});
