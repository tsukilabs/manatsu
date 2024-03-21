import type { Nullish } from '@tb-dev/utility-types';
import type { Component, InjectionKey, Ref, ShallowRef } from 'vue';
import type { DarkMode, DialogOptions, ErrorHandler } from './types';

type RefSymbol<T> = InjectionKey<Readonly<Ref<T>>>;
type WritableRefSymbol<T> = InjectionKey<Ref<T>>;
type WritableShallowRefSymbol<T> = InjectionKey<ShallowRef<T>>;

type ComponentSymbol = WritableShallowRefSymbol<Nullish<Component>>;
type ComponentPropsSymbol = WritableShallowRefSymbol<Nullish<Record<string, unknown>>>;

// App
const darkMode = Symbol() as WritableRefSymbol<DarkMode>;
const errorHandler = Symbol() as InjectionKey<Nullish<ErrorHandler>>;

// Scaffold
const scaffoldBottomHeight = Symbol() as RefSymbol<number>;
const scaffoldContentHeight = Symbol() as RefSymbol<number>;
const scaffoldSidebarWidth = Symbol() as RefSymbol<number>;
const scaffoldTopHeight = Symbol() as RefSymbol<number>;

const showOnlyScaffoldContent = Symbol() as WritableRefSymbol<boolean>;
const showScaffoldBottom = Symbol() as WritableRefSymbol<boolean>;
const showScaffoldSidebar = Symbol() as WritableRefSymbol<boolean>;
const showScaffoldTop = Symbol() as WritableRefSymbol<boolean>;

// Dialog
const dynDialogDefault = Symbol() as ComponentSymbol;
const dynDialogDefaultProps = Symbol() as ComponentPropsSymbol;

const dynDialogFooter = Symbol() as ComponentSymbol;
const dynDialogFooterProps = Symbol() as ComponentPropsSymbol;

const dynDialogHeader = Symbol() as ComponentSymbol;
const dynDialogHeaderProps = Symbol() as ComponentPropsSymbol;

const dynDialogOnHide = Symbol() as WritableShallowRefSymbol<Nullish<() => void>>;
const dynDialogOnShow = Symbol() as WritableShallowRefSymbol<Nullish<() => void>>;

const dynDialogOptions = Symbol() as WritableShallowRefSymbol<Nullish<DialogOptions>>;
const dynDialogVisible = Symbol() as WritableRefSymbol<boolean>;
const placeDialogOnScaffold = Symbol() as RefSymbol<boolean>;

export const symbols = {
  darkMode,
  scaffoldBottomHeight,
  scaffoldContentHeight,
  scaffoldSidebarWidth,
  scaffoldTopHeight,
  showOnlyScaffoldContent,
  showScaffoldBottom,
  showScaffoldSidebar,
  showScaffoldTop
} as const;

export const privateSymbols = {
  dynDialogDefault,
  dynDialogDefaultProps,
  dynDialogFooter,
  dynDialogFooterProps,
  dynDialogHeader,
  dynDialogHeaderProps,
  dynDialogOnHide,
  dynDialogOnShow,
  dynDialogOptions,
  dynDialogVisible,
  errorHandler,
  placeDialogOnScaffold
} as const;
