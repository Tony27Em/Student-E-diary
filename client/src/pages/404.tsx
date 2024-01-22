import { NextPage } from "next";
import Image from "next/image";
import notFoundImage from '../../public/404-6.png';
import { useRouter } from "next/router";

const NotFound: NextPage = () => {
  const { replace } = useRouter();

  return (
    <div className="error">
      <Image
        src={notFoundImage}
        alt="NOT FOUND"
        width={700}
        height={700}
      />
      <h1 className="text">Страница не найдена! <br /> P.S. Он не спит, он думает...</h1>
      <button onClick={() => replace('/')} className="back-button">Вернуться на главную</button>

      <style jsx>
        {`
          .error {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
          }

          .text {
            text-align: center;
          }

          .back-button {
            padding: 20px 50px;
            margin-top: 40px;
            border: none;
            border-radius: 5px;
            background-color: #42a5f5;
            color: #fff;
            font-size: 1em;
            font-weight: 700;
            text-transform: uppercase;
            transition: 0.2s;
            cursor: pointer;
          }

          .back-button:hover {
            background-color: #1976d2;
          }
        `}
      </style>
    </div>
  )
}

export default NotFound;