import { Resvg } from '@resvg/resvg-js'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '../public')

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="102" fill="#4f46e5"/>
  <circle cx="102.4" cy="140.8" r="58.9" stroke="white" stroke-width="41" fill="none"/>
  <circle cx="102.4" cy="371.2" r="58.9" stroke="white" stroke-width="41" fill="none"/>
  <line x1="153.6" y1="166.4" x2="448" y2="332.8" stroke="white" stroke-width="41" stroke-linecap="round"/>
  <line x1="153.6" y1="345.6" x2="448" y2="179.2" stroke="white" stroke-width="41" stroke-linecap="round"/>
</svg>
`

for (const size of [192, 512]) {
  const resvg = new Resvg(iconSvg, { fitTo: { mode: 'width', value: size } })
  const png = resvg.render().asPng()
  writeFileSync(join(publicDir, `icon-${size}.png`), png)
  console.log(`Generated public/icon-${size}.png`)
}
