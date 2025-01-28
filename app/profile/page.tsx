import { getinfo } from '@/lib/action';
import Profile from './profile';

const page = async () => {
  const data = await getinfo();
  return (
    <div>
      <Profile infoUser={data.data} />
    </div>
  )
}

export default page
