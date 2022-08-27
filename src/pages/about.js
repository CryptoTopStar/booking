import React from "react"
import { graphql } from "gatsby"
import { makeStyles } from '@material-ui/core/styles'
import { GatsbyImage } from "gatsby-plugin-image";
import Box from '@material-ui/core/Box'
import useInquiry from '../hooks/useInquiry'
import { Link } from "@material-ui/core"
import {
  Link as LinkIcon
} from 'react-feather'

const useStyles = makeStyles((theme) => ({
  link: {
    margin: '0 5px'
  },
}))

const About = ({ data }) => {
  const classes = useStyles()
  const inquiry = useInquiry()

  const handleClick = () => {
    inquiry.handleOpen()
  };

  return <>
    <div className="eyecatch">
      <figure>
        <GatsbyImage image={data.about.childImageSharp.gatsbyImageData} alt="ブルーベリー＆ヨーグルト" />
      </figure>
    </div>
    <article className="content">
      <div className="container">
        <h1 className="bar">ESSENTIALSについて</h1>
        <aside className="info">
          <div className="subtitle">
            <i className="fas fa-utensils"></i>
              ABOUT ESSENTIALS
          </div>
        </aside>
        <div className="postbody">
          <p>
            sample SAMPLE
          </p>
        </div>
        <Box mb="5rem" />
        <h1 className="bar">お問い合わせ</h1>
        <div className="postbody">
          お問い合わせは
          <span className={classes.link}>
            <Link href="#" onClick={handleClick}>
              <LinkIcon size={20} />こちら
          </Link>
          </span>
          から
          </div>
      </div>
    </article>
  </>;
}

export const query = graphql`{
  about: file(relativePath: {eq: "about.jpg"}) {
    childImageSharp {
      gatsbyImageData(layout: FULL_WIDTH)
      original {
        src
        height
        width
      }
    }
  }
}
`

export default About