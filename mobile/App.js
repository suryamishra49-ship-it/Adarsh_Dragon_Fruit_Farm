import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'guide': return <GuideView onBack={() => setCurrentView('home')} />;
      case 'scanner': return <ScannerView onBack={() => setCurrentView('home')} />;
      case 'marketplace': return <MarketplaceView onBack={() => setCurrentView('home')} />;
      default: return <HomeView onNavigate={setCurrentView} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {renderView()}
    </SafeAreaView>
  );
}

// --- HOME VIEW ---
function HomeView({ onNavigate }) {
  return (
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

        <TouchableOpacity style={styles.btnPrimary} onPress={() => onNavigate('guide')}>
          <Text style={styles.btnPrimaryText}>Start Farming Guide</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => onNavigate('marketplace')}>
          <Text style={styles.btnSecondaryText}>Explore Marketplace</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Features</Text>
        
        <TouchableOpacity style={styles.featureCard} onPress={() => onNavigate('guide')}>
          <Text style={styles.featureIcon}>🌱</Text>
          <Text style={styles.featureTitle}>Step-by-Step Guide</Text>
          <Text style={styles.featureDesc}>Interactive modules guiding you through soil prep, trellising, pruning, and harvesting.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard} onPress={() => onNavigate('scanner')}>
          <Text style={styles.featureIcon}>📸</Text>
          <Text style={styles.featureTitle}>AI Disease Scanner</Text>
          <Text style={styles.featureDesc}>Upload a photo of your dragon fruit or leaves. Our Gemini AI instantly detects diseases.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard} onPress={() => onNavigate('marketplace')}>
          <Text style={styles.featureIcon}>🛒</Text>
          <Text style={styles.featureTitle}>Farmer's Marketplace</Text>
          <Text style={styles.featureDesc}>Buy high-quality cuttings or sell your premium harvest directly to buyers.</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// --- GUIDE VIEW ---
function GuideView({ onBack }) {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.0.2.2:3001/api/guide/steps') // Use 10.0.2.2 for Android Emulator connecting to localhost
      .then(r => r.json())
      .then(data => { setSteps(data.steps || []); setLoading(false); })
      .catch(e => { console.error(e); setLoading(false); });
  }, []);

  return (
    <View style={styles.viewContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
      <Text style={styles.viewTitle}>Farming Guide</Text>
      
      {loading ? <Text style={{color: 'white'}}>Loading...</Text> : (
        <ScrollView>
          {steps.map(step => (
            <View key={step.id} style={styles.card}>
              <Text style={styles.cardTitle}>{step.id}. {step.title}</Text>
              <Text style={styles.cardDesc}>{step.description}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// --- SCANNER VIEW ---
function ScannerView({ onBack }) {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setAnalyzing(true);
    
    let localUri = image;
    let filename = localUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append('image', { uri: localUri, name: filename, type });

    try {
      let res = await fetch('http://10.0.2.2:3001/api/scanner/analyze', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      let data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.viewContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
      <Text style={styles.viewTitle}>AI Disease Scanner</Text>
      
      {!image ? (
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          <Text style={{fontSize: 40, marginBottom: 10}}>📸</Text>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Tap to Upload Photo</Text>
        </TouchableOpacity>
      ) : (
        <View style={{alignItems: 'center'}}>
          <Image source={{ uri: image }} style={{width: 300, height: 300, borderRadius: 12, marginBottom: 20}} />
          <TouchableOpacity style={styles.btnPrimary} onPress={analyzeImage} disabled={analyzing}>
            <Text style={styles.btnPrimaryText}>{analyzing ? 'Analyzing...' : 'Analyze Image'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {result && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Diagnosis</Text>
          <Text style={styles.cardDesc}>{result.diagnosis}</Text>
          <Text style={{color: '#E94580', marginTop: 10, fontWeight: 'bold'}}>Confidence: {(result.confidence * 100).toFixed(0)}%</Text>
          <Text style={{color: 'white', marginTop: 10, fontWeight: 'bold'}}>Recommendations:</Text>
          {result.recommendations?.map((r, i) => (
            <Text key={i} style={styles.cardDesc}>- {r}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// --- MARKETPLACE VIEW ---
function MarketplaceView({ onBack }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.0.2.2:3001/api/marketplace/products')
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoading(false); })
      .catch(e => { console.error(e); setLoading(false); });
  }, []);

  return (
    <View style={styles.viewContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
      <Text style={styles.viewTitle}>Marketplace</Text>
      
      {loading ? <Text style={{color: 'white'}}>Loading...</Text> : (
        <ScrollView>
          {products.map(p => (
            <View key={p.id} style={styles.card}>
              <Text style={styles.cardTitle}>{p.name}</Text>
              <Text style={{color: '#a19ba8', marginBottom: 10}}>by {p.farmer}</Text>
              <Text style={{color: '#D32F6A', fontWeight: 'bold', fontSize: 18}}>${p.price.toFixed(2)} / {p.unit}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0c13' },
  scrollContent: { padding: 20, paddingTop: 40 },
  viewContainer: { padding: 20, paddingTop: 40, flex: 1 },
  header: { marginBottom: 40, alignItems: 'center' },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  logoAccent: { color: '#D32F6A' },
  heroSection: { marginBottom: 50 },
  title: { fontSize: 36, fontWeight: '800', color: '#ffffff', lineHeight: 40 },
  titleGradient: { fontSize: 36, fontWeight: '800', color: '#D32F6A', lineHeight: 40, marginBottom: 16 },
  subtitle: { fontSize: 16, color: '#a19ba8', marginBottom: 30, lineHeight: 24 },
  btnPrimary: { backgroundColor: '#D32F6A', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  btnPrimaryText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  btnSecondary: { backgroundColor: 'transparent', paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  btnSecondaryText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  featuresSection: { marginBottom: 40 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 20, textAlign: 'center' },
  featureCard: { backgroundColor: '#1c1624', padding: 24, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  featureIcon: { fontSize: 40, marginBottom: 12 },
  featureTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 },
  featureDesc: { color: '#a19ba8', lineHeight: 22 },
  backBtn: { marginBottom: 20 },
  backText: { color: '#D32F6A', fontSize: 16, fontWeight: 'bold' },
  viewTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  card: { backgroundColor: '#1c1624', padding: 20, borderRadius: 12, marginBottom: 16 },
  cardTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardDesc: { color: '#a19ba8', lineHeight: 22 },
  uploadBtn: { backgroundColor: '#1c1624', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed', padding: 40, borderRadius: 16, alignItems: 'center' },
});
