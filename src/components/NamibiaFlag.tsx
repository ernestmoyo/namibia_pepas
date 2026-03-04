interface NamibiaFlagProps {
  className?: string
  width?: number
  height?: number
}

export default function NamibiaFlag({
  className,
  width = 32,
  height = 20,
}: NamibiaFlagProps) {
  return (
    <img
      src="/namibia-flag.png"
      alt="Namibia Flag"
      width={width}
      height={height}
      className={className}
      style={{ objectFit: "contain" }}
    />
  )
}
