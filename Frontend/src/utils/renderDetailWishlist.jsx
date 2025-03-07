import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ImagePlaceholder from '../assets/imageplaceholder.png'
import Rendercurrency from './renderCurrency'

const API_ENDPOINT = window._env_.REACT_APP_API_ENDPOINT

class RenderDetailWishlist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            games: [],
            isLoading: false,
            isError: false,
            ownagePreviewOk: <>&#10004;</>,
            ownagePreviewFalse: <>&#x2715;</>,
            ownagePreviewSold: <div style={{ marginLeft: '2px', marginRight: '2px' }}>&#83;</div>,
            filter: localStorage.getItem('filter'),
            file: false
        }
    }

    async componentDidMount() {
        this.fetchMode()
        this.setState({ isLoading: true, file: ImagePlaceholder })
        const response = await fetch(`${API_ENDPOINT}/api/wishlist/${this.state.filter}`, { credentials: 'include' })
        if (response.ok) {
            const games = await response.json()
            this.setState({ games, isLoading: false })
        } else {
            this.setState({ isError: true, isLoading: false })
        }
    }

    fetchMode = async () => {
        const response = await fetch(`${API_ENDPOINT}/api/settingsdata`, {
            credentials: 'include',
        })
        if (response.ok) {
            const fetchdata = await response.json()
            this.setState({ fetchdata })
            this.state.fetchdata.map((data) => {
                return this.setState({ resolution: data.resolution })
            })
        } else {
            this.setState({ isError: true, isLoading: false })
        }
    }

    render() {

        return (
            <div>

                <div className="overviewContainer">
                    {this.renderGames()}
                </div>

            </div>
        )
    }


    renderGames = () => {
        const { games, isLoading, isError } = this.state

        if (isLoading) {
            return <div>Loading...</div>
        }

        if (isError) {
            return <div>Error</div>
        }

        return games.length > 0
            ? (this.state.games.map(game => {

            const imageName = game.filename
            const title = game.title
            const price = game.price
            const url = `${API_ENDPOINT}/uploads/${imageName}`

            return (

                <div key={game.id} className="gamesShow">

                    <Link to={{
                        pathname: `/gamedetail/${title}` }} >
                        <div className="imageWrapper">

                            {imageName !== "null" ? <img src={`${url}`} alt="" className="imagePreview" />
                                : <img src={`${ImagePlaceholder}`} alt="" className="imagePreview" />}

                        </div>
                    </Link>
                    <div className="gameTitle">{title}</div>
                    <div className="bottomSection">
                        <div className="gamePrice">{price}&nbsp;<Rendercurrency /></div>
                        {game.saleprice === '' && this.state.resolution === 'enabled' ? (
                            <div>
                                {game.ownage === 'false' ? (
                                    <div className='ownagePreviewFalse'>
                                        {this.state.ownagePreviewFalse}
                                    </div>
                                ) : (
                                    <div className='ownagePreviewOk'>
                                        {this.state.ownagePreviewOk}
                                    </div>
                                )}
                            </div>
                        ) : this.state.resolution === 'disabled' ? (
                            <div>
                                {game.ownage === 'false' ? (
                                    <div className='ownagePreviewFalse'>
                                        {this.state.ownagePreviewFalse}
                                    </div>
                                ) : (
                                    <div className='ownagePreviewOk'>
                                        {this.state.ownagePreviewOk}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className='ownagePreviewSold'>
                                {this.state.ownagePreviewSold}
                            </div>
                        )}

                    </div>
                </div>

            )
        })
            ) : (
                <div style={{color: 'var(--text-primary)'}}>
                    No games.
                </div>
            )
    }
}

export default RenderDetailWishlist