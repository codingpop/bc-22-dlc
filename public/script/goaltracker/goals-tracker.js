/**
 * keeps tracks of the user goals and progress for each course
 * @class GoalsTracker
 */
export default class GoalsTracker {
  /**
   * Creates an instance of GoalsTracker.
   * @param {any} level - this is the number of level for each course
   * @param {any} state - this is the current state(level) of the user, default to 1
   * @memberOf GoalsTracker
   */
  constructor(level, state = 1) {
    this.state = state;
    this.level = level;
    this.passLevel = this.initCheckLevel();
  }
  /**
   *  Initializes an array of course chapters, serves as a check of courses passed
   * @returns - an array of checkList mapping each level to a boolean; true if the level
   *            is passed and false otherwise
   * @memberOf GoalsTracker
   */
  initCheckLevel() {
    const checkLevel = {};
    for (let i = 1; i <= this.level; i += 1) {
      checkLevel[i] = false;
    }
    return checkLevel;
  }

  /**
   * Keeps track of the user progress percentage through the course
   * @returns - the current progress percentage
   * @memberOf GoalsTracker
   */
  trackProgress() {
    let progressPercent = 0;
    if (this.state < this.level && !this.passLevel[this.state]) {
      this.passLevel[this.state] = true;
      this.state += 1;
      progressPercent = Math.abs((this.state / this.level) * 100);
      console.log('next assessment');
    }
    if (this.state === this.level && !this.passLevel[this.state]) {
      progressPercent = 100;
      this.passLevel[this.state] = true;
      console.log('Assessment has ended!!!');
    }
    return progressPercent;
  }

  /**
   * @param {any} desiredState - the desired goal
   * @param {any} setTime - the desired time for goal completion
   * @returns - an object containing the desired state and the set time
   * @memberOf GoalsTracker
   */
  setGoal(desiredState, setTime) {
    this.desiredState = desiredState;
    this.setTime = new Date(setTime).getTime();
    this.goal = {
      desiredState: this.desiredState,
      setTime: this.setTime
    };
    return this.goal;
  }

  /**
   *  Checks if the user meets the goal he sets.
   * @returns - a report containing a suitable message, if the user meets up or not.
   * @memberOf GoalsTracker
   */
  checkGoalMeet() {
    let report = {};
    const startTime = Date.now();
    const initialState = this.state;
    if (initialState === this.goal.desiredState && startTime <= this.goal.setTime) {
      report = {
        message: 'Goal Achieved'
      };
    } else {
      report = {
        message: 'Time has run out'
      };
    }
    return report;
  }

}
