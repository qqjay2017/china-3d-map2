const side =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMxSURBVHgB7dZBDcJQFADBB/kCuHAgAQckHAA3Tf27aIXsjIjNXv7bfgyQdB0gSwAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgbN2erwGaHACECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCErfv7M0CTA4AwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCw9fj+BmhyABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABB2Amb1BS2MWc5zAAAAAElFTkSuQmCC",
  guangquan1 =
    "data:image/png;base64,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",
  guangquan2 =
    "data:image/png;base64,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";

const flyLine =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAEACAYAAADFkM5nAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQpSURBVHgB7dZBEYQwFECxv+u1plqxYIATJ2ZeoiK/vfc1wCtrreG7zjkDPPsPAJAjAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAECQAABAkAAAQJAAAEHQDPSsHzYG+LBMAAAAASUVORK5CYII=";

const flyLineFocus =
  "data:image/png;base64,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";

const arrow =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgB7ddhbcMwEAXglyEoBEPoGARCIYTBymBhMAgrhDFoIZTBIATC21lxtGhdYieOW7u6T7L6x5HvfPXJBpRSSj0jko2MGqWTJL7tQMkkgSN/tSiRBG5cNQadjB1KI0GfeOsDJXHVmFKjFBLseSaRM0rg2q3PAbn7c8Cn2Dn5HnwJ7p3hWuSI/QHvFiRi5xrkhv+3W59P5ITz7danRi4YdsCn5NGOGdZufRo8kgSwi6zGIPoe9oI4bzIM4tkkjngExh3wqaoYrBRTkRbbslW5bzuWnTswnRorVFiB/dPVII1rVVWvWGjxX4t9qzRIZy9rpD34vH2+zrnIaN03dtj3+zXw27TPYvrvUxcXsMH8ZjRu7pw0z2JOt9sh+MU7GJCUwdZG1ejcwg03LP8oqa9RItvew9i325P7Tf6yY3/1GdbcQymllFJKKaUy9gO4eI9ILG1riwAAAABJRU5ErkJggg==";

const point =
  "data:image/png;base64,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";
export { guangquan2, guangquan1, side, flyLine, flyLineFocus, arrow, point };