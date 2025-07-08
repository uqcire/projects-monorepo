// 创建计时器间隔
export const createTimerInterval = (activeTimers, playerId) => {
  return setInterval(() => {
    if (activeTimers[playerId].seconds === 59) {
      activeTimers[playerId].minutes++
      activeTimers[playerId].seconds = 0
    } else {
      activeTimers[playerId].seconds++
    }
  }, 1000)
}

// 开始计时
export const startTimer = (activeTimers, timerIntervals, editingStats, playerId) => {
  if (!activeTimers[playerId]) {
    activeTimers[playerId] = {
      minutes: editingStats[playerId]?.MIN || 0,
      seconds: 0,
      isRunning: true
    }
    timerIntervals[playerId] = createTimerInterval(activeTimers, playerId)
  } else if (!activeTimers[playerId].isRunning) {
    activeTimers[playerId].isRunning = true
    timerIntervals[playerId] = createTimerInterval(activeTimers, playerId)
  }
}

// 暂停计时
export const pauseTimer = (activeTimers, timerIntervals, playerId) => {
  if (activeTimers[playerId]) {
    clearInterval(timerIntervals[playerId])
    activeTimers[playerId].isRunning = false
  }
}

// 停止计时并保存
export const stopTimer = (activeTimers, timerIntervals, editingStats, playerId) => {
  if (activeTimers[playerId]) {
    clearInterval(timerIntervals[playerId])
    editingStats[playerId].MIN = activeTimers[playerId].minutes
    delete activeTimers[playerId]
    delete timerIntervals[playerId]
  }
}

// 批量操作计时器
export const startAllTimers = (activeTimers, timerIntervals, editingStats) => {
  Object.keys(activeTimers).forEach(playerId => {
    startTimer(activeTimers, timerIntervals, editingStats, playerId)
  })
}

export const pauseAllTimers = (activeTimers, timerIntervals) => {
  Object.keys(activeTimers).forEach(playerId => {
    pauseTimer(activeTimers, timerIntervals, playerId)
  })
}

export const stopAllTimers = (activeTimers, timerIntervals, editingStats) => {
  Object.keys(activeTimers).forEach(playerId => {
    stopTimer(activeTimers, timerIntervals, editingStats, playerId)
  })
}

// 清理所有计时器
export const clearAllTimers = (timerIntervals) => {
  Object.keys(timerIntervals).forEach(playerId => {
    clearInterval(timerIntervals[playerId])
  })
}
