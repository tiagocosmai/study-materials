# React Native — UI móvel, performance e lojas

## Introdução

**React Native** mapeia componentes JS para **views nativas**. Diferente do DOM web, há **bridge** (serialização) ou **JSI** (chamadas mais directas). Problemas reais: **jank** em listas longas, imagens grandes, e *navigation* mal estruturada.

```mermaid
flowchart LR
  JS[JS thread]
  NAT[Native UI thread]
  JS <-->|bridge/JSI| NAT
```

---

## Problema real: lista de 10k itens lenta

**Sintoma:** scroll a saltar; memória alta.

**Solução:** **`FlatList`** com `windowSize`, `maxToRenderPerBatch`, `removeClippedSubviews`, e `getItemLayout` quando altura fixa.

```tsx
import { FlatList, StyleSheet, Text, View } from "react-native";

type Row = { id: string; title: string };

export function BigList({ data }: { data: Row[] }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <View style={{ paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#e2e8f0" }}>
          <Text>{item.title}</Text>
        </View>
      )}
      initialNumToRender={12}
      windowSize={7}
      maxToRenderPerBatch={16}
      removeClippedSubviews
    />
  );
}
```

Referência: [FlatList perf](https://reactnative.dev/docs/optimizing-flatlist-configuration).

---

## Imagens e cache

**Problema real:** URL remota sem cache — scroll de imagens recarrega sempre.

Use **`expo-image`** ou `react-native-fast-image` (dependendo do stack) com política de cache; defina `width`/`height` ou `aspectRatio` para evitar *layout thrash*.

---

## Teclado e formulários

**Problema real:** teclado cobre o `TextInput`; botão “Submeter” inacessível.

Soluções: `KeyboardAvoidingView` (iOS/Android com `behavior` distinto), `react-native-keyboard-controller`, ou *scroll* automático para o foco.

```tsx
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";

export function FormScreen() {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1, padding: 16 }}>
        <TextInput placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
      </View>
    </KeyboardAvoidingView>
  );
}
```

---

## Deep links e *universal links*

**Caso real:** email com link `https://app.com/order/42` abre app instalado.

Configurar **Associated Domains** (iOS) e **App Links** (Android) + rota no *navigator* (React Navigation `linking`).

---

## OTA updates (Expo)

**Expo Updates** permite corrigir JS sem passar pela loja — **não** substitui revisão da Apple/Google para mudanças de política; binários nativos ainda precisam de *store build*.

---

## App mínimo (Expo)

```bash
npx create-expo-app@latest MeuApp
cd MeuApp && npx expo start
```

```tsx
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header">Olá</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
```

---

## Padrão inteligente: `@shopify/flash-list` em vez de `FlatList` pesado

**Problema:** *scroll* de catálogo com imagens e *headers* — *blanking* e *FPS* baixo.

**Solução:** **FlashList** recicla células de forma mais agressiva (API semelhante a `FlatList`).

```bash
npm i @shopify/flash-list
```

```tsx
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={rows}
  estimatedItemSize={72}
  renderItem={({ item }) => <Row item={item} />}
/>;
```

Documentação: [FlashList](https://shopify.github.io/flash-list/).

---

## Nível avançado: *Reanimated* para animações na *UI thread*

**Problema:** `Animated` clássico atravessa a *bridge* — animações competem com JS.

**Solução:** **react-native-reanimated** + **react-native-gesture-handler** para *worklets*.

---

## Nível avançado: armazenamento rápido com **MMKV**

**Problema:** `AsyncStorage` lento para *feature flags* e cache de chave pequena.

**Solução:** [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) (síncrono, mapeamento memória-mapped).

---

## Referências

- [React Native — Docs](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Performance overview](https://reactnative.dev/docs/performance)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) · [Material Design](https://m3.material.io/)
- [FlashList](https://shopify.github.io/flash-list/) · [Reanimated](https://docs.swmansion.com/react-native-reanimated/) · [MMKV](https://github.com/mrousavy/react-native-mmkv)

---

*Mobile exige pensar em **bateria**, **rede instável** e **gestos** — não só em pixels.*
