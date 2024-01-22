import { NextPage, GetServerSideProps, GetServerSidePropsResult } from "next";
import Image from "next/image";
import Layout from "@/components/layout/layout";
import styles from '@/styles/rewards.module.scss';
import diamond from '../../public/diamond.png';
import badge from '../../public/badge.png';
import { useDataContext } from "@/context/dataContext";
import { API_URL } from "@/http";
import axios from 'axios';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const rewardsImagesAPI = 'http://localhost:5000/rewardsImages/';

type RewardItemType = {
  _id: string,
  image: string,
  name: string,
  crystal: number,
  badge: number,
  description: string,
}

type RewardsType = {
  rewardsList: RewardItemType[],
}

const Rewards: NextPage<RewardsType> = ({ rewardsList }) => {
  const { theme } = useTheme();
  const superbadge = rewardsList[0];
  
  const { userData } = useDataContext();    
  const rewards = userData?.data?.academic_info?.rewards;
  
  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if(!mounted) return null;

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={`${styles.container_header} ${theme ? styles[theme] : styles.light}`}>Достижения</h1>

        <div className={`${styles.superbadge} ${theme ? styles[theme] : styles.light}`}>
          <img
            src={rewardsImagesAPI + superbadge.image}
            alt="No image"
            className={rewards?.includes(superbadge._id) ? '' : styles.completed}
          />
          <h3>{superbadge.name}</h3>
          <p style={{ textAlign: 'center' }}>{superbadge.description}</p>
          <div className={styles.coins}>
            <div>
              <span>+{superbadge.crystal}</span>
              <Image src={diamond} alt="crystal_image" width={24} height={24} />
            </div>
            <div>
              <span>+{superbadge.badge}</span>
              <Image src={badge} alt="badge_image" width={24} height={24} />
            </div>
          </div>
          <div className={styles.buttons}>
            <button title='No functionality' className={styles.buttons_init}>Как оставить отзыв?</button>
            <button title='No functionality' className={styles.buttons_init}>Получить бейдж за отзыв</button>
            <button title='No functionality' className={styles.buttons_facebook}>Оставить отзыв в Facebook</button>
            <button title='No functionality' className={styles.buttons_google}>Оставить отзыв в Google</button>
          </div>
        </div>

        <div className={styles.rewards_list}>
          {
            rewardsList.slice(1).map(reward => (
              <div
                key={reward._id}
                className={`${styles.rewards_item} ${theme ? styles[theme] : styles.light }`}
              >
                <img
                  src={rewardsImagesAPI + reward.image}
                  alt="No image"
                  className={rewards?.includes(reward._id) ? '' : styles.completed}
                />
                <h3>{reward.name}</h3>
                <div className={styles.rewards_coins}>
                  <div>
                    <span>+{reward.crystal}</span>
                    <Image src={diamond} alt="crystal_image" width={24} height={24} />
                  </div>
                  {!!reward.badge &&
                    <div>
                      <span>+{reward.badge}</span>
                      <Image src={badge} alt="badge_image" width={24} height={24} />
                    </div>
                  }
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </Layout>
  )
}

export default Rewards;

export const getServerSideProps: GetServerSideProps<RewardsType> = async (context): Promise<GetServerSidePropsResult<RewardsType>> => {
  const response = await axios.get<RewardItemType[]>(API_URL + '/getRewardsList');
  const rewardsList = response.data;

  return {
    props: { rewardsList },
  }
} 