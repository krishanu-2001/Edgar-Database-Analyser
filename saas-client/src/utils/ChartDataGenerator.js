import { FEATURES, MATRICS } from '../constants';
import { isNotDefined } from './utils';

export const chartDataGenerator = (feature, form) => {
    let d = []
    if (Object.keys(FEATURES).includes(feature)) {
        form.forEach(year => {
            if (isNotDefined([year.features[feature]])) {
                return
            }
            d.push({
                name: year.id,
                label: feature,
                [feature]: year.features[feature]
            })

        })
    } else if (Object.keys(MATRICS).includes(feature)) {
        form.forEach(year => {
            if (isNotDefined([year.matrics[feature]])) {
                return
            }
            d.push({
                name: year.id,
                label: feature,
                [feature]: year.matrics[feature]
            })
        })
    }
    d.sort(function (a, b) {
        const c = Number(a.name.replaceAll('-', ''));
        const d = Number(b.name.replaceAll('-', ''));
        return c - d;
    });
    return d;
}
