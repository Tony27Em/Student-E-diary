import { SyntheticEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import { useTheme } from "next-themes";
import { GetServerSidePropsResult } from "next/types";
import Image from "next/image";
import { MdExpandMore } from 'react-icons/md';
import Layout from "@/components/layout/layout";
import faqImage from '../../public/faq-image.png';
import styles from '@/styles/faq.module.scss';
import axios from "axios";
import { API_URL } from "@/http";
import Typography from '@mui/material/Typography';
import { styled } from "@mui/material";
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid lightgray`,
  borderRadius: 5,
  '&:before': {
    display: 'none',
  },
  marginBottom: 10,
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<MdExpandMore size={24} color='#000' />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: 'row',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  '& .MuiAccordionSummary-content *': {
    fontWeight: 700,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

type FAQItemType = {
  _id: string,
  question: string;
  answer: string;
}

type FAQsType = {
  data: FAQItemType[];
}

const Faq: NextPage<FAQsType> = ({ data }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState<string | false>('panel0');

  const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={`${styles.container_header} ${theme ? styles[theme] : styles.light}`}>Ответы на часто задаваемые вопросы</h2>
        <div className={styles.container_faq}>
          <Image
            src={faqImage}
            alt=''
            className={styles.container_faq_image}
            priority
          />

          <div className={styles.container_faq_list}>
            {
              data.map(({ _id, question, answer }, index) => (
                <Accordion
                  key={_id}
                  expanded={expanded === 'panel' + index}
                  className={styles.container_faq_item}
                  style={{
                    backgroundColor: theme === 'light' ? '#f5f6fa' : '#212940',
                    color: theme === 'light' ? '#000' : '#fff',
                    border: theme === 'light' ? '' : 0
                  }}
                  onChange={handleChange('panel' + index)}
                >
                  <AccordionSummary
                    expandIcon={<MdExpandMore
                      size={24}
                      color={theme === 'light' ? '#000' : '#fff'}
                    />}
                    aria-controls="panel1a-content"
                  >
                    <Typography>
                      <span>{question}</span>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Faq;

export const getServerSideProps = async (): Promise<GetServerSidePropsResult<FAQsType>> => {
  const response = await axios.get<FAQItemType[]>(API_URL + '/getFaqData');
  const data = response.data;

  return {
    props: { data },
  }
} 