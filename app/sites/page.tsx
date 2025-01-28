import { fetchDataApi } from '@/lib/action'
import Sites from './page_'

const page = async () => {
  const resp = await fetchDataApi('sites')
  console.log(resp)
  return (
    <div>
      <Sites data={resp} />
    </div>
  )
}

export default page
