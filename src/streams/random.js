import mappable from './util/mappable'
import point from './util/point'

const random = x => Math.floor(Math.random() * x)

export default (every = 200) => () => mappable(next => {
  const interval = setInterval(() => (
    next(
      point(
        [random(window.innerWidth), random(window.innerHeight)],
        window,
        'random'
      )
    )
  ), every)
  return () => clearInterval(interval)
})
