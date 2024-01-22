import { FC, useEffect, useState, SyntheticEvent } from 'react';
import { useTheme } from 'next-themes';
import $api, { API_URL } from '@/http';
import { MdExpandMore } from "react-icons/md";
import styles from '@/styles/homepage/news.module.scss';

import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  borderRadius: 5,
  '&:before': {
    display: 'none',
  },
  marginBottom: 5,
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  flexDirection: 'row',
  borderRadius: 5,
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
}));

type NewsItemType = {
  _id: string;
  title: string;
  text: string;
  published: string;
}

const News: FC = () => {
  const [newsData, setNewsData] = useState<NewsItemType[]>([]);
  const [expanded, setExpanded] = useState<string | false>('panel0');
  const { theme } = useTheme();

  const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    async function getNewsData() {
      try {
        const response = await $api.get(API_URL + '/getNewsData');
        setNewsData(response.data);
      } catch (err) {
        console.error('Не удалось получить новостные данные');
      }
    }
    getNewsData();
  }, [])

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <div className={`${styles.container} ${theme ? styles[theme] : styles.light}`}>
      <div className={styles.header}>
        <h2>Новости</h2>
      </div>

      <div className={styles.news_list}>
        {
          newsData.map(({ _id, title, text, published }, index) => (
            <Accordion 
              key={_id} 
              expanded={expanded === 'panel' + index} 
              onChange={handleChange('panel' + index)}
              style={{ 
                backgroundColor: theme === 'light' ? '#f5f6fa' : '#1a2036',
                color: theme === 'light' ? '#000' : '#fff'
              }}
            >
              <AccordionSummary 
                expandIcon={<MdExpandMore size={24} color={theme === 'light' ? '#000' : '#fff'} />}
                aria-controls="panel1d-content" id="panel1d-header"
              >
                <Typography>
                  <small>{published}</small>
                  <br />
                  <span>{title}</span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {text}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        }
      </div>
    </div>
  )
}

export default News;
