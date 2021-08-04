import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Tooltip,
  Select,
  notification
} from 'antd';
import request from '../../../../../../../utils/request';

const { Option } = Select;

const ContractInfoFields = ({ form }) => {

  const [sourcesLoading, setSourcesLoading] = useState(false);
  const [financeSources, setFinanceSources] = useState([]);
  const [customSource, SetCustomSource] = useState(
    form.getFieldValue(["contractInfo", "financeSourceId"]) === 5
  );

  useEffect(() => {
    setSourcesLoading(true);
    request.get("/finance_sources").then(res => {
      setFinanceSources(res.data);
    }).catch(() => {
      notification.error({ message: "Не удалось загрузить источники финансирования" })
    }).finally(() => {
      setSourcesLoading(false);
    })
  }, [setFinanceSources, setSourcesLoading]);


  return (
  <Form.Item
    label="Дополнительная информация для договора"
    style={{ marginTop: '50px' }}
  >
    <Form.Item
      name={["contractInfo", "contractPerson"]}
      label="Лицо заключающее договор"
    >
      <Input/>
    </Form.Item>
    <Form.Item
      name={["contractInfo", "contractAuthority"]}
      label="Действует на основании"
    >
      <Input/>
    </Form.Item>
    <Form.Item
      name={["contractInfo", "financeSourceId"]}
      label="Источник финансирования"
    >
      <Select
        disabled={sourcesLoading}
        placeholder="Выберите источник финансирования"
        onChange={value => SetCustomSource(value === 5)}
      >
        {
          financeSources.map(({id, name}) => 
            <Option
            key={id}
            value={id}>
              {name}
            </Option>)
        }
      </Select>
    </Form.Item>
    {
      customSource &&
      <Form.Item
        name={["contractInfo", "customFinanceSource"]}
        label="Иной источник финансирования"
      >
        <Input
        placeholder="Укажите источник финансирования"
        />
      </Form.Item>
    }
  </Form.Item>
  );
}


export default ContractInfoFields;