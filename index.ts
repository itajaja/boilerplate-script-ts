import { App, Chart, ChartProps } from 'cdk8s';
import { Construct } from 'constructs';

import { KubeDeployment } from './imports/k8s';

const label = { a: 'foo' };

interface Props extends ChartProps {
  version: string;
}

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    new KubeDeployment(this, 'deployment', {
      spec: {
        selector: {
          matchLabels: label,
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'hello-kubernetes',
                image: `paulbouwer/hello-kubernetes:${props.version}`,
                ports: [{ containerPort: 8080 }],
              },
            ],
          },
        },
      },
    });
  }
}

const app = new App();
new MyChart(app, 'k8s', { namespace: 'jocasta', version: '1.24' });
app.synth();
