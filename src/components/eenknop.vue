<template>
  <div>
    <div>
      <img src="../assets/knopje.png" @click.stop.prevent="onKnopped" />
      <!--svg width="200" height="200">
        <defs>
          <linearGradient
            id="glass"
            gradientUnits="userSpaceOnUse"
            x1="-100"
            y1="-100"
            x2="100"
            y2="100">
            <stop
              offset="0"
              style="stop-color:#fff;stop-opacity:1;" />
            <stop
              offset="1"
              style="stop-color:#fff;stop-opacity:0;" />
          </linearGradient>
        </defs>

        <g transform="translate(100,100)">
          <circle r="100" class="core-btn" />
          <circle r="94" style="fill:url(#glass)" />
        </g>
      </svg-->
    </div>

    <div v-if="config.kind === 'count'" class="total">{{ counttTotal }}</div>
    <div v-else-if="config.kind === 'stopwatch'">
      <div v-if="stopwatch.state === 'running'">{{ swRunTime }}</div>
      <div class="total">
        <span v-if="swLatest">Latest: {{ swLatest.duration }}ms</span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'EenKnop',

  data() {
    return {
      config: {
        name: 'train delay',
        kind: 'stopwatch',
      },
      stopwatch: {
        state: 'idle',
        startedAt: null,
        elapsedMs: -1,
      },
    };
  },
  computed: {
    druks() {
      return this.$store.state.druks[this.config.name] || [];
    },

    countTotal() {
      if (this.config.kind !== 'count') {
        return 'Can only total COUNT kind knops';
      }
      return this.druks.reduce(a => a + 1, 0);
    },

    swLatest() {
      if (!this.druks || !this.druks.length) {
        return null;
      }
      return this.druks[this.druks.length - 1];
    },

    swRunTime() {
      if (this.stopwatch.state === 'idle') {
        return '-';
      }

      const ms = this.stopwatch.elapsedMs;
      const seconds = (Math.floor(ms / 10) / 100);
      return `${seconds}s`;
    },
  },

  methods: {
    onKnopped() {
      const now = moment();
      const { kind } = this.config;

      if (kind === 'count') {
        this.$store.dispatch('onDruk', {
          config: this.config,
          payload: {
            when: now,
          },
        });
      }
      else if (kind === 'stopwatch') {
        if (this.stopwatch.state === 'running') {
          this.$store.dispatch('onDruk', {
            config: this.config,
            payload: {
              startedAt: this.stopwatch.startedAt,
              durationMs: now.diff(this.stopwatch.startedAt),
            },
          })
            .then(() => {
              this.stopwatch.startedAt = null;
              this.stopwatch.state = 'idle';
              this.stopwatch.elapsedMs = -1;
            });
        }
        else {
          this.stopwatch.startedAt = moment();
          this.stopwatch.state = 'running';
          this.stopwatch.elapsedMs = 0;
          setInterval(() => {
            this.stopwatch.elapsedMs = moment().diff(this.stopwatch.startedAt);
          }, 100);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
img {
  width: 200px;
}

.total {
  text-align: center;
  font-size: 5rem;
  font-weight: 100;
}


@btnCol: #e57a1a;
.core-btn {
  fill: @btnCol;
}

</style>
