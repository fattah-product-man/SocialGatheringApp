import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { GlowCard } from '@aura-ui/core';
import { ArrowLeft } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';

const PRESETS = [
  { label: 'Violet Dream', colors: ['#a78bfa', '#6d28d9', '#4c1d95'], intensity: 1 },
  { label: 'Ocean Pulse', colors: ['#22d3ee', '#0ea5e9', '#1d4ed8'], intensity: 1.4 },
  { label: 'Solar Flare', colors: ['#fbbf24', '#f97316', '#dc2626'], intensity: 1.8 },
  { label: 'Emerald Glow', colors: ['#34d399', '#10b981', '#059669'], intensity: 1.2 },
];

export default function GlowCardScreen() {
  const router = useRouter();
  const [activePreset, setActivePreset] = useState(0);
  const preset = PRESETS[activePreset];

  return (
    <View className="flex-1 bg-aura-bg px-5 pt-16">
      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        className="mb-6 flex-row items-center gap-2"
      >
        <ArrowLeft size={20} color="#a78bfa" />
        <Text className="text-sm font-medium text-aura-accent">Gallery</Text>
      </Pressable>

      {/* Title */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 400 }}
      >
        <Text className="text-2xl font-bold text-aura-text">GlowCard</Text>
        <Text className="mt-1 text-sm text-aura-muted">
          Animated gradient border with glassmorphism effect. Powered by Skia +
          Reanimated.
        </Text>
      </MotiView>

      {/* Preview */}
      <View className="mt-8 items-center">
        <GlowCard
          colors={preset.colors}
          intensity={preset.intensity}
        >
          <View className="items-center p-6">
            <Text className="text-lg font-bold text-white">
              {preset.label}
            </Text>
            <Text className="mt-2 text-center text-sm text-zinc-400">
              intensity: {preset.intensity} · {preset.colors.length} colors
            </Text>
          </View>
        </GlowCard>
      </View>

      {/* Preset selector */}
      <Text className="mb-3 mt-10 text-xs font-semibold uppercase tracking-widest text-aura-muted">
        Presets
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {PRESETS.map((p, i) => (
          <Pressable
            key={p.label}
            onPress={() => setActivePreset(i)}
            className={`rounded-full border px-4 py-2 ${
              i === activePreset
                ? 'border-aura-accent bg-aura-accent/15'
                : 'border-aura-border bg-aura-surface'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                i === activePreset ? 'text-aura-accent' : 'text-aura-muted'
              }`}
            >
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Props display */}
      <View className="mt-8 rounded-xl border border-aura-border bg-aura-surface p-4">
        <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-aura-muted">
          Props
        </Text>
        <Text className="font-mono text-xs text-zinc-400">
          {`<GlowCard\n  intensity={${preset.intensity}}\n  colors={${JSON.stringify(preset.colors)}}\n>\n  {children}\n</GlowCard>`}
        </Text>
      </View>
    </View>
  );
}
