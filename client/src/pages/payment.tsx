import { NextPage } from "next";
import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/layout/layout";
import styles from '../styles/payment.module.scss';
import { useTheme } from "next-themes";

type PaymentHistoryType = {
  status: string,
  amount: number,
  due_date: string,
  payment_date: string,
  description: string,
}

// For demonstration
const paymentHistory: PaymentHistoryType[] = [
  { status: 'Оплачено', amount: 53000, due_date: '20.01.2023', payment_date: '18.01.2023', description: 'Оплата через Каспи' },
  { status: 'Оплачено', amount: 53000, due_date: '20.02.2023', payment_date: '15.02.2023', description: 'Оплата через Каспи' },
  { status: 'Оплачено', amount: 53000, due_date: '20.03.2023', payment_date: '13.03.2023', description: 'Оплата через Каспи' },
  { status: 'Отменено', amount: 53000, due_date: '20.04.2023', payment_date: '13.04.2023', description: 'Оплата онлайн' },
  { status: 'Оплачено', amount: 53000, due_date: '20.04.2023', payment_date: '13.04.2023', description: 'Оплата онлайн' },
  { status: 'Оплачено', amount: 53000, due_date: '20.05.2023', payment_date: '20.05.2023', description: 'Оплата онлайн' },
  { status: 'Оплачено', amount: 53000, due_date: '20.06.2023', payment_date: '15.06.2023', description: 'Оплата через Каспи' },
  { status: 'Оплачено', amount: 53000, due_date: '20.07.2023', payment_date: '16.07.2023', description: 'Оплата через Каспи' },
  { status: 'Оплачено', amount: 53000, due_date: '20.08.2023', payment_date: '13.08.2023', description: 'Оплата через Каспи' },
  { status: 'Оплачено', amount: 53000, due_date: '20.09.2023', payment_date: '14.09.2023', description: 'Оплата онлайн' },
  { status: 'Оплачено', amount: 53000, due_date: '20.10.2023', payment_date: '19.10.2023', description: 'Оплата через Каспи' },
  { status: 'Оплачено', amount: 53000, due_date: '20.11.2023', payment_date: '20.11.2023', description: 'Оплата через Каспи' },
  { status: 'Неоплачено', amount: 53000, due_date: '20.11.2023', payment_date: '-', description: '-' },
]

const statusesColorCode: { [key: string]: string } = {
  'Оплачено': '#18b10a',
  'Отменено': '#b50000',
  'В обработке': '#ffd503',
  'Неоплачено': '#878787',
}

const Payment: NextPage = () => {
  const { theme } = useTheme();
  const [sum, setSum] = useState<string | undefined>('');
  const [warning, setWarning] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const memoedPaymentHistory = useMemo(() => paymentHistory.reverse(), []);

  const handleClick = () => {
    if (!!sum && +sum > 10_000) {
      if (typeof window !== 'undefined') {
        window.open("https://epay.homebank.kz/", '_blank')
      }
      return;
    }
    setWarning(true);
  }

  const handleInput = (value: string) => {
    setSum(value);
    setWarning(false);
    setDisabled(false);

    if (!value) setDisabled(true);
  }

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={`${styles.container_header} ${theme ? styles[theme] : styles.light}`}>Платежи {theme}</h1>

        <div className={`${styles.form} ${theme ? styles[theme] : styles.light}`}>
          <h3 className={styles.form_header}>Оплата обучения</h3>
          <div className={styles.form_input}>
            <input
              value={sum}
              type="number"
              inputMode="numeric"
              placeholder="Введите сумму"
              onChange={(e) => handleInput(e.target.value)}
            />
            {
              warning && <small className={styles.warning}>Введена сумма ниже минимально допустимой</small>
            }
          </div>
          <button
            className={`${styles.form_button} ${disabled ? styles.disabled : ''}`}
            onClick={handleClick}
            disabled={disabled}
          >Оплатить</button>
          <div className={styles.form_details}>
            <h3>Реквизиты для оплаты</h3>
            <div>
              <p>Для получения данных об оплате обратитесь в бухгалтерию</p>
              <b>1C код: 123***789</b>
            </div>
          </div>
        </div>

        <div className={`${styles.history} ${theme ? styles[theme] : styles.light}`}>
          <h3 className={styles.history_header}>История платежей</h3>
          <div className={styles.history_details}>
            {
              !!memoedPaymentHistory.length ? paymentHistory.map((item, index) => (
                <div
                  key={index}
                  style={{ backgroundColor: theme === 'light' ? '#f1f1f1' : '#1a2036' }}
                >
                  <div>
                    <small className={styles.history_details_status}>Статус</small>
                    <span>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: statusesColorCode[item.status] }}></div>
                      <span>{item.status}</span>
                    </span>
                  </div>
                  <div>
                    <small>Сумма</small>
                    <span>{item.amount}</span>
                  </div>
                  <div>
                    <small>Срок оплаты</small>
                    <span>{item.due_date}</span>
                  </div>
                  <div>
                    <small>Дата оплаты</small>
                    <span>{item.payment_date}</span>
                  </div>
                  <div>
                    <small>Описание</small>
                    <span>{item.description}</span>
                  </div>
                </div>
              )) : <span>Здесь пока ничего нет</span>
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Payment;