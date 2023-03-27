declare function plugin(
  options?: Partial<{
    className: string;
    perspective: number;
    layers: { id: number; depth: number };
  }>
): {
  handler: () => void;
};

declare namespace plugin {
  const __isOptionsFunction: true;
}

export = plugin;
