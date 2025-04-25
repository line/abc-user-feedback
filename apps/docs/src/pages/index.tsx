import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

const IndexPage = () => {
  const { siteConfig } = useDocusaurusContext();
  return <Layout title={siteConfig.title}></Layout>;
};

export default IndexPage;
