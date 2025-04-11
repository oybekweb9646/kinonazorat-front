import { useMutation } from '@/shared/hooks';
import { useProfile } from '@/shared/hooks/use-profile/use-profile';
import { useQueryClient } from '@tanstack/react-query';
import { Switch } from 'antd';
import { JSX, useState } from 'react';
import { toast } from 'react-toastify';

export default function AssessmentSwitch({ item }: any): JSX.Element {
  const [checked, setChecked] = useState<boolean>(item.max_score === item.score);
  const { data, isFetching } = useProfile();
  const profile = data?.data?.user;

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: 'set-point',
  });

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
          queryClient.invalidateQueries({ queryKey: ['request-indicators'] });
        },
      },
    );
  }

  const isDisabled = item?.updated_by?.id && item?.updated_by?.id !== profile?.id && checked;

  return (
    <Switch
      checked={checked}
      onChange={onChange}
      loading={isPending || isFetching}
      disabled={isDisabled}
    />
  );
}
