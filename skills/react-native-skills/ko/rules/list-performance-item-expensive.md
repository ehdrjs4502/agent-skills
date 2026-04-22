---
title: 목록 아이템을 가볍게 유지
impact: HIGH
impactDescription: 스크롤 중 보이는 아이템의 렌더 시간 감소
tags: lists, performance, virtualization, hooks
---

## 목록 아이템을 가볍게 유지

목록 아이템은 렌더 비용이 최대한 낮아야 합니다.
훅을 최소화하고, 쿼리를 피하고, React Context 접근을 제한하세요.
가상화 목록은 스크롤 중 많은 아이템을 렌더합니다. 비용이 큰 아이템은 끊김을 유발합니다.

**잘못된 예시 (무거운 목록 아이템):**

```tsx
function ProductRow({ id }: { id: string }) {
  // 잘못됨: 목록 아이템 내부에서 쿼리
  const { data: product } = useQuery(['product', id], () => fetchProduct(id))
  // 잘못됨: 여러 컨텍스트 접근
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)
  const cart = useContext(CartContext)
  // 잘못됨: 비용이 큰 계산
  const recommendations = useMemo(
    () => computeRecommendations(product),
    [product]
  )

  return <View>{/* ... */}</View>
}
```

**올바른 예시 (가벼운 목록 아이템):**

```tsx
function ProductRow({ name, price, imageUrl }: Props) {
  // 좋음: 기본형만 받고, 훅 최소화
  return (
    <View>
      <Image source={{ uri: imageUrl }} />
      <Text>{name}</Text>
      <Text>{price}</Text>
    </View>
  )
}
```

**데이터 패칭을 부모로 이동:**

```tsx
// 부모가 데이터를 한 번에 가져옴
function ProductList() {
  const { data: products } = useQuery(['products'], fetchProducts)

  return (
    <LegendList
      data={products}
      renderItem={({ item }) => (
        <ProductRow name={item.name} price={item.price} imageUrl={item.image} />
      )}
    />
  )
}
```

**공유 값에는 Context 대신 Zustand 셀렉터 사용:**

```tsx
// 잘못됨: Context는 장바구니 값이 변경될 때마다 리렌더
function ProductRow({ id, name }: Props) {
  const { items } = useContext(CartContext)
  const inCart = items.includes(id)
  // ...
}

// 올바름: Zustand 셀렉터는 이 특정 값이 변경될 때만 리렌더
function ProductRow({ id, name }: Props) {
  // 루트에서 한 번 생성된 Set.has() 사용 (Array.includes() 대신)
  const inCart = useCartStore((s) => s.items.has(id))
  // ...
}
```

**목록 아이템 가이드라인:**

- 쿼리나 데이터 패칭 없음
- 비용이 큰 계산 없음 (부모로 이동하거나 부모 레벨에서 메모이즈)
- React Context보다 Zustand 셀렉터 선호
- useState/useEffect 훅 최소화
- 미리 계산된 값을 props로 전달

목표: 목록 아이템은 props를 받아 JSX를 반환하는 단순한 렌더 함수여야 합니다.
