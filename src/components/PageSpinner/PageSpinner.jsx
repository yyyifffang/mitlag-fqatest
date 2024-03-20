'use client'
// bootstrap
import Spinner from 'react-bootstrap/Spinner'

const style = {
    width:"100vw",
    height: "100vh",
    display: "grid",
    placeItems: "center",
    position: "fixed",
    top: "0",
    backgroundColor: "white",
    transition: "500ms ease-in-out"
}

export default function PageSpinner({ showing, hideHeader }) {
    const zIndex = hideHeader? 100: 9
    return (
        <div style={{
            ...style,
            opacity : showing? 1 :0,
            zIndex: showing? zIndex: -100,
        }}>
            <div>
                <Spinner animation="grow" variant="dark" />{' '}
                <Spinner animation="grow" variant="dark" />{' '}
                <Spinner animation="grow" variant="dark" />
            </div>
        </div>
    )
}
