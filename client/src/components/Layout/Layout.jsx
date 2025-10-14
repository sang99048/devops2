import { Toaster } from "react-hot-toast"
import Header from './Header.jsx'
import { Helmet } from 'react-helmet'


const Layout = ({ children, title, description, keywords, author }) => {
    return (
        <div className="wraperAllWeb">
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                <title>{title}</title>

            </Helmet>
            <Header />
            <Toaster position="top-center"
                reverseOrder={false} />
            <main>{children}</main>

        </div>
    )
}

Layout.defaultProps = {
    title: "invoice management system",
    description: "Mern stack project",
    keywords: "React.js, Node.js, MongoDb",
    author: 'TranVietChinh'
}

export default Layout