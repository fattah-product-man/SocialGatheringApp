import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { ChevronRight, Sparkles, Layers } from 'lucide-react-native';

interface ComponentEntry {
  name: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  tags: string[];
}

const COMPONENTS: ComponentEntry[] = [
  {
    name: 'GlowCard',
    description: 'Animated gradient border with glassmorphism blur',
    route: '/components/glow-card',
    icon: <Sparkles size={20} color="#a78bfa" />,
    tags: ['Skia', 'Reanimated'],
  },
];

function ComponentCard({ item, index }: { item: ComponentEntry; index: number }) {
  const router = useRouter();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay: index * 100 }}
    >
      <Pressable
        onPress={() => router.push(item.route as never)}
        className="mb-3 rounded-2xl border border-aura-border bg-aura-surface p-4 active:opacity-70"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-aura-accent/10">
              {item.icon}
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-aura-text">
                {item.name}
              </Text>
              <Text className="mt-0.5 text-sm text-aura-muted">
                {item.description}
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color="#71717a" />
        </View>
        <View className="mt-3 flex-row gap-2">
          {item.tags.map((tag) => (
            <View
              key={tag}
              className="rounded-full bg-aura-accent/10 px-2.5 py-0.5"
            >
              <Text className="text-xs font-medium text-aura-accent">
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </Pressable>
    </MotiView>
  );
}

export default function GalleryIndex() {
  return (
    <ScrollView
      className="flex-1 bg-aura-bg"
      contentContainerClassName="px-5 pb-10 pt-16"
    >
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
      >
        <View className="mb-2 flex-row items-center gap-2">
          <Layers size={22} color="#a78bfa" />
          <Text className="text-sm font-semibold uppercase tracking-widest text-aura-accent">
            Aura UI
          </Text>
        </View>
        <Text className="text-3xl font-bold text-aura-text">
          Component Gallery
        </Text>
        <Text className="mt-1 text-base text-aura-muted">
          Browse, preview, and pick components for production.
        </Text>
      </MotiView>

      {/* Divider */}
      <View className="my-6 h-px bg-aura-border" />

      {/* Component List */}
      <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-aura-muted">
        {COMPONENTS.length} Component{COMPONENTS.length !== 1 ? 's' : ''}
      </Text>

      {COMPONENTS.map((item, index) => (
        <ComponentCard key={item.name} item={item} index={index} />
      ))}
    </ScrollView>
  );
}
