import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import tailwindConfig from './tailwind.config'
const postcssConfig = {
    plugins: [tailwind(tailwindConfig), autoprefixer],
}
export default postcssConfig
