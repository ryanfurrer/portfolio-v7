/**
 * A small hello for anyone who opens the dev console: the atom brand mark in
 * the brand vermilion, plus a one-line greeting. Purely cosmetic.
 *
 * The art is generated from the real logo SVG (public/favicon.svg) rasterized
 * and mapped to a brightness ramp, so it matches the actual mark — a ring with
 * two crossing ellipses and a four-pointed center.
 */
const art = `
              :-==++++==-:
          :=*##****++****##*=:
       :+@@@@#+-.      .-+#@@@%+:
     :#@%+===+*#%#*==*#%#*+===+%@#:
    =@@=        :#@@@@#:        =@@=
   *@@#       -#%#=..=#%#-       %@@*
  *@+@%     -#@*:      :*@#-     %@+@*
 -@# *@=  :#@*.          .*@#:  =@* #@-
 #@: .%@:+@#:              :#@+:@%. -@#
 @@   .%@@=                  =@@%.   @@
 @@   .%@@=                  =@@%.   @@
 #@: .%@:+@#:              :#@+:@%. -@#
 -@# *@=  :#@*.          .*@#:  =@* #@-
  *@+@%     -#@*:      :*@#-     %@+@*
   *@@#       -#%#=..=#%#-       %@@*
    =@@=        :#@@@@#:        =@@=
     :#@%+===+*#%#*==*#%#*+===+%@#:
       :+%@@@#+-.      .-+#@@@%+:
          :=*###***++***###*=:
              .-==++++==-.
`;

// Brand vermilion for the mark; mid-gray for the message so it stays legible
// on both light and dark consoles.
console.log(
  `%c${art}`,
  "color:#ed3f1c;font-weight:700;line-height:1;font-family:ui-monospace,monospace",
);
console.log(
  "%cThanks for looking under the hood. 👋",
  "color:#ed3f1c;font-size:13px;font-weight:700",
);
console.log(
  "%cBuilt by Ryan Furrer — frontend engineer & designer\nhttps://ryanfurrer.com",
  "color:#86868b;font-size:12px;line-height:1.5",
);
