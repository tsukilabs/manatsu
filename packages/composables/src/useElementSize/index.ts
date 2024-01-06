import { type ComputedRef, type Ref, readonly, toRef } from 'vue';
import {
  type MaybeComputedElementRef,
  type MaybeElement,
  type ShallowUnwrapRef,
  extendRef,
  useElementSize
} from '@vueuse/core';
import { useToPixel } from '../useToPixel';

// prettier-ignore
type UseSideRef<Pixel extends boolean> = Pixel extends true
  ? ComputedRef<string>
  : Ref<number>;

// prettier-ignore
type UseSideExtendedRef<Pixel extends boolean> = Readonly<UseSideRef<Pixel>> & ShallowUnwrapRef<{
  stop: () => void;
}>;

// prettier-ignore
type UseSideReturn<Pixel extends boolean> = 
  <T extends MaybeElement>(el: MaybeComputedElementRef<T>) => UseSideExtendedRef<Pixel>;

// prettier-ignore
function useSide<Pixel extends boolean>(side: 'height' | 'width', px: Pixel): UseSideReturn<Pixel> {
  const fn = <T extends MaybeElement>(el: MaybeComputedElementRef<T>) => {
    const size = useElementSize(
      toRef(el),
      { height: 0, width: 0 },
      { box: 'border-box' }
    );

    const sideRef = px ? useToPixel(size[side]) : size[side];
    const extended = extendRef(sideRef, { stop: size.stop });
    return readonly(extended);
  };

  return fn as UseSideReturn<Pixel>;
}

export const useHeight = useSide('height', false);
export const useWidth = useSide('width', false);

export const usePixelHeight = useSide('height', true);
export const usePixelWidth = useSide('width', true);
