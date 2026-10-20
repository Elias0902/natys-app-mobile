import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';

// Login illustration: phone with password screen + person (Natys red palette)
export default function LoginIllustration({ size = 300 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 320 320">
      <Circle cx="160" cy="165" r="135" fill="#ffffff" opacity="0.1" />
      <Ellipse cx="170" cy="278" rx="120" ry="10" fill="#000" opacity="0.18" />

      {/* plant */}
      <G>
        <Path d="M40 270 C30 235 40 215 58 205 C62 230 58 250 40 270Z" fill="#fecaca" />
        <Path d="M52 272 C50 240 66 222 86 218 C84 244 74 262 52 272Z" fill="#fca5a5" />
        <Rect x="38" y="266" width="30" height="16" rx="4" fill="#7f1d1d" />
      </G>

      {/* phone */}
      <Rect x="70" y="45" width="115" height="225" rx="20" fill="#ffffff" />
      <Rect x="79" y="58" width="97" height="199" rx="12" fill="#fee2e2" />
      <SvgText x="127" y="108" fontSize="12" fontWeight="bold" fill="#7f1d1d" textAnchor="middle">Password</SvgText>
      <Rect x="90" y="120" width="75" height="24" rx="7" fill="#ffffff" stroke="#fca5a5" />
      {[103, 115, 127, 139, 151].map((x) => <Circle key={x} cx={x} cy="132" r="3" fill="#7f1d1d" />)}
      <Rect x="98" y="160" width="59" height="20" rx="10" fill="#dc2626" />
      <SvgText x="127" y="174" fontSize="9" fontWeight="bold" fill="#fff" textAnchor="middle">Entrar</SvgText>
      {[117, 127, 137].map((x) => <Circle key={x} cx={x} cy="240" r="2.5" fill="#fca5a5" />)}

      {/* lock badge */}
      <Circle cx="182" cy="82" r="24" fill="#dc2626" />
      <Path d="M173 84 V78 A9 9 0 0 1 191 78 V84" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <Rect x="170" y="83" width="24" height="18" rx="4" fill="#fff" />
      <Circle cx="182" cy="92" r="2.5" fill="#dc2626" />

      {/* person */}
      <Path d="M213 132 C213 112 237 112 237 132 L237 140 L213 140Z" fill="#1f2937" />
      <Circle cx="225" cy="130" r="13" fill="#f7b98b" />
      <Path d="M212 126 C212 110 238 110 238 126 C232 120 218 120 212 126Z" fill="#1f2937" />
      <Rect x="208" y="144" width="34" height="62" rx="12" fill="#dc2626" />
      <Path d="M210 156 L188 184" stroke="#dc2626" strokeWidth="11" strokeLinecap="round" />
      <Circle cx="186" cy="187" r="6" fill="#f7b98b" />
      <Path d="M240 156 L252 196" stroke="#dc2626" strokeWidth="11" strokeLinecap="round" />
      <Rect x="211" y="202" width="13" height="64" rx="5" fill="#1f2937" />
      <Rect x="226" y="202" width="13" height="64" rx="5" fill="#111827" />
      <Ellipse cx="215" cy="270" rx="12" ry="5" fill="#fff" />
      <Ellipse cx="236" cy="270" rx="12" ry="5" fill="#fff" />
    </Svg>
  );
}
