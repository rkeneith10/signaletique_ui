import { fetchDataApi } from '@/lib/action'
import Dashboard from './page_'

const page = async () => {
  const responseSite = await fetchDataApi('sites')
  const responsePost = await fetchDataApi('posts')
  const responseEmployes = await fetchDataApi('employees')

  return (
    <div>
      <Dashboard sites={responseSite} employes={responseEmployes} postes={responsePost} />
    </div>
  )
}

export default page
