import MemberImg1 from 'assets/images/member1.png';
import MemberImg2 from 'assets/images/member2.png';
import MemberImg3 from 'assets/images/member3.png';
import SampleImg from 'assets/images/sample1.png';
import CoinsImg from 'assets/svgs/coins.svg';
import LoadmapLg from 'assets/svgs/loadmap-lg.svg';
import LoadmapSm from 'assets/svgs/loadmap-sm.svg';
import { MemberCard } from 'components/Card/MemberCard/MemberCard';
import { Questions } from 'components/Card/QuestionsCard/QuestionsCard';
import { Footer } from 'components/Footer/Footer';
import { Header } from 'components/Header/Header';
import useMedia from 'use-media';
import './App.css';
import { MintPanel } from './components/MintPanel/MintPanel';
import { useConnectWallet } from './hooks/useConnectWallet';
import { useContract } from './hooks/useContract';

function App() {
  const { library, ...wallet } = useConnectWallet();
  const contract = useContract(
    '0xbe4c2C4425289d316b7f455E6e62db91a34EcFC9',
    library,
    wallet.active
  );

  const isMedium = useMedia({ minWidth: '768px' });

  return (
    <div className="App">
      <Header />
      <main className="main">
        <section className="first-section about-section p-app">
          <div>
            <h1 className="h1">Minting now</h1>
            <p className="description">
              Quia sed quod fuga tempora. Officiis voluptas asperiores numquam.
              Velit occaecati et et blanditiis ab placeat qui.
            </p>
          </div>
          <img src={CoinsImg} className="coins" />
        </section>

        <section className="section p-app mint-section" id="mint">
          <h1 className="h1 align-center">Mint</h1>
          <MintPanel
            imageSrc={SampleImg}
            signerAddr={String(wallet?.account)}
            {...wallet}
            {...contract}
          />
        </section>

        <section
          className={`section roadmap-section ${isMedium ? '' : 'p-app'}`}
          id="roadmap"
        >
          <h1 className="h1 align-center">Roadmap</h1>

          <div className="roadmap">
            <img src={isMedium ? LoadmapLg : LoadmapSm} alt="loadmap" />
          </div>
        </section>

        <section className="section p-app" id="team">
          <h1 className="h1 align-center">Team</h1>

          <div className="members">
            <MemberCard
              imageSrc={MemberImg1}
              name="Akbar Shamji"
              role="President + CEO"
              twitterLink="https://twitter.com/"
            />
            <MemberCard
              imageSrc={MemberImg2}
              name="Akbar Shamji"
              role="President + CEO"
              twitterLink="https://twitter.com/"
            />
            <MemberCard
              imageSrc={MemberImg3}
              name="Akbar Shamji"
              role="President + CEO"
              twitterLink="https://twitter.com/"
            />
          </div>
        </section>

        <section className="section p-app" id="faq">
          <h1 className="h1 align-center">Frequently Asked Questions</h1>

          <Questions />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
