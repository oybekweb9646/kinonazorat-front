import { useMutation } from '@/shared/hooks';
import { Switch } from 'antd';
import { JSX, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AssessmentSwitch({ item, refetch = () => {} }: any): JSX.Element {
  const [checked, setChecked] = useState<boolean>(false);

  const { mutate, isPending } = useMutation({
    mutationKey: 'set-point',
  });

  useEffect(() => {
    setChecked(item.max_score === item.score);
  }, [item]);

  function onChange(checked: boolean) {
    mutate(
      {
        url: `/score-indicator-request/set-point/${item.id}`,
        data: {
          score: checked,
        },
      },
      {
        onSuccess: () => {
          toast.success('Muvaffaqiyatli saqlandi');
          setChecked(checked);
          refetch();
        },
      },
    );
  }

  return <Switch checked={checked} onChange={onChange} loading={isPending} />;
}
