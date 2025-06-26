import React, { useState, useEffect } from 'react';
import '../styles/ExecutableFormPage.css';
import { TreeNode } from '../utils/TreeNode';
import { createTreeNode } from '../utils/TreeUtils';

const ExecutableFormPage = ({ moduleState, setModuleState }) => {
    const [activeTab, setActiveTab] = useState('exeForm');

    // ExeForm 관련 상태
    const [exeFormInputs, setExeFormInputs] = useState({
        exeFileURL: '',
        shell: ''
    });
    const [selectedExeFormIndex, setSelectedExeFormIndex] = useState(null);
    const [propertyRoot, setPropertyRoot] = useState(new TreeNode());

    // LibURL 관련 상태
    const [libURLInput, setLibURLInput] = useState('');
    const [selectedLibIndex, setSelectedLibIndex] = useState(null);

    // ExecutableForm 초기화
    useEffect(() => {
        if (!moduleState.executableForm) {
            setModuleState(prev => ({
                ...prev,
                executableForm: {
                    exeForms: [],
                    lib: {
                        urlnPaths: []
                    }
                }
            }));
        }
    }, [moduleState.executableForm, setModuleState]);

    // ExeForm 선택 시 입력폼에 값 반영
    const handleSelectExeForm = (index) => {
        setSelectedExeFormIndex(index);
        const exeForm = moduleState.executableForm.exeForms[index];
        if (exeForm) {
            setExeFormInputs({
                exeFileURL: exeForm.exeFileURL || '',
                shell: exeForm.shell || ''
            });
            // Property 설정 (간단히 구현)
            if (exeForm.properties) {
                setPropertyRoot(createTreeNode(exeForm.properties));
            } else {
                setPropertyRoot(new TreeNode());
            }
        }
    };

    // LibURL 선택 시 입력폼에 값 반영
    const handleSelectLibURL = (index) => {
        setSelectedLibIndex(index);
        const url = moduleState.executableForm.lib.urlnPaths[index];
        if (url) {
            setLibURLInput(url);
        }
    };

    // ExeForm 추가
    const handleAddExeForm = () => {
        if (!exeFormInputs.exeFileURL.trim()) {
            alert('ExeFileURL을 입력해주세요.');
            return;
        }

        const newExeForm = {
            exeFileURL: exeFormInputs.exeFileURL,
            shell: exeFormInputs.shell || null,
            properties: propertyRoot.getValue()?.properties || null
        };

        setModuleState(prev => ({
            ...prev,
            executableForm: {
                ...prev.executableForm,
                exeForms: [...(prev.executableForm?.exeForms || []), newExeForm]
            }
        }));

        setExeFormInputs({ exeFileURL: '', shell: '' });
        setSelectedExeFormIndex(null);
        setPropertyRoot(new TreeNode());
    };

    // ExeForm 업데이트
    const handleUpdateExeForm = () => {
        if (selectedExeFormIndex === null) return;
        if (!exeFormInputs.exeFileURL.trim()) {
            alert('ExeFileURL을 입력해주세요.');
            return;
        }

        const updatedExeForm = {
            exeFileURL: exeFormInputs.exeFileURL,
            shell: exeFormInputs.shell || null,
            properties: propertyRoot.getValue()?.properties || null
        };

        setModuleState(prev => ({
            ...prev,
            executableForm: {
                ...prev.executableForm,
                exeForms: prev.executableForm.exeForms.map((form, i) =>
                    i === selectedExeFormIndex ? updatedExeForm : form
                )
            }
        }));

        setExeFormInputs({ exeFileURL: '', shell: '' });
        setSelectedExeFormIndex(null);
        setPropertyRoot(new TreeNode());
    };

    // ExeForm 삭제
    const handleDeleteExeForm = () => {
        if (selectedExeFormIndex === null) return;

        setModuleState(prev => ({
            ...prev,
            executableForm: {
                ...prev.executableForm,
                exeForms: prev.executableForm.exeForms.filter((_, i) => i !== selectedExeFormIndex)
            }
        }));

        setExeFormInputs({ exeFileURL: '', shell: '' });
        setSelectedExeFormIndex(null);
        setPropertyRoot(new TreeNode());
    };

    // LibURL 추가
    const handleAddLibURL = () => {
        if (!libURLInput.trim()) {
            alert('Library URL을 입력해주세요.');
            return;
        }

        setModuleState(prev => ({
            ...prev,
            executableForm: {
                ...prev.executableForm,
                lib: {
                    ...prev.executableForm.lib,
                    urlnPaths: [...(prev.executableForm?.lib?.urlnPaths || []), libURLInput]
                }
            }
        }));

        setLibURLInput('');
        setSelectedLibIndex(null);
    };

    // LibURL 업데이트
    const handleUpdateLibURL = () => {
        if (selectedLibIndex === null) return;
        if (!libURLInput.trim()) {
            alert('Library URL을 입력해주세요.');
            return;
        }

        setModuleState(prev => ({
            ...prev,
            executableForm: {
                ...prev.executableForm,
                lib: {
                    ...prev.executableForm.lib,
                    urlnPaths: prev.executableForm.lib.urlnPaths.map((url, i) =>
                        i === selectedLibIndex ? libURLInput : url
                    )
                }
            }
        }));

        setLibURLInput('');
        setSelectedLibIndex(null);
    };

    // LibURL 삭제
    const handleDeleteLibURL = () => {
        if (selectedLibIndex === null) return;

        setModuleState(prev => ({
            ...prev,
            executableForm: {
                ...prev.executableForm,
                lib: {
                    ...prev.executableForm.lib,
                    urlnPaths: prev.executableForm.lib.urlnPaths.filter((_, i) => i !== selectedLibIndex)
                }
            }
        }));

        setLibURLInput('');
        setSelectedLibIndex(null);
    };

    // 입력폼 초기화
    const clearInputs = () => {
        setExeFormInputs({ exeFileURL: '', shell: '' });
        setLibURLInput('');
        setSelectedExeFormIndex(null);
        setSelectedLibIndex(null);
        setPropertyRoot(new TreeNode());
    };

    return (
        <div className="executable-form-page">
            {/* 탭 헤더 */}
            <div className="executable-form-tabs">
                <button
                    className={`executable-form-tab ${activeTab === 'exeForm' ? 'active' : ''}`}
                    onClick={() => setActiveTab('exeForm')}
                >
                    ExeForm
                </button>
                <button
                    className={`executable-form-tab ${activeTab === 'libURLs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('libURLs')}
                >
                    LibURLs
                </button>
            </div>

            {/* ExeForm 탭 */}
            {activeTab === 'exeForm' && (
                <div className="executable-form-content">
                    {/* 입력 영역 */}
                    <div className="executable-form-input-section">
                        <div className="executable-form-row">
                            <div className="executable-form-group">
                                <label className="executable-form-label">
                                    ExeFileURL (Path of executable file that shall be executed)
                                </label>
                                <input
                                    type="text"
                                    value={exeFormInputs.exeFileURL}
                                    onChange={(e) => setExeFormInputs(prev => ({ ...prev, exeFileURL: e.target.value }))}
                                    className="executable-form-input"
                                    placeholder="Enter executable file URL"
                                />
                            </div>
                            <div className="executable-form-group">
                                <label className="executable-form-label">Shell Command</label>
                                <textarea
                                    value={exeFormInputs.shell}
                                    onChange={(e) => setExeFormInputs(prev => ({ ...prev, shell: e.target.value }))}
                                    className="executable-form-textarea"
                                    placeholder="Enter shell command"
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="executable-form-row">
                            <div className="executable-form-group">
                                <label className="executable-form-label">Property</label>
                                <div className="executable-form-property-placeholder">
                                    Property tree view will be implemented here
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="executable-form-actions">
                        <button
                            onClick={handleAddExeForm}
                            className="executable-form-btn"
                            disabled={!exeFormInputs.exeFileURL.trim()}
                        >
                            Add ExeForm
                        </button>
                        <button
                            onClick={handleUpdateExeForm}
                            className="executable-form-btn"
                            disabled={selectedExeFormIndex === null}
                        >
                            Update ExeForm
                        </button>
                        <button
                            onClick={handleDeleteExeForm}
                            className="executable-form-btn executable-form-btn--danger"
                            disabled={selectedExeFormIndex === null}
                        >
                            Delete ExeForm
                        </button>
                    </div>

                    {/* ExeForm 테이블 */}
                    <div className="executable-form-table-container">
                        <table className="executable-form-table">
                            <thead>
                                <tr>
                                    <th>ExeFileURL</th>
                                    <th>Shell Cmd</th>
                                    <th>Property</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(moduleState.executableForm?.exeForms || []).map((exeForm, index) => (
                                    <tr
                                        key={index}
                                        className={selectedExeFormIndex === index ? 'selected' : ''}
                                        onClick={() => handleSelectExeForm(index)}
                                    >
                                        <td>{exeForm.exeFileURL}</td>
                                        <td>{exeForm.shell || 'None'}</td>
                                        <td>{exeForm.properties ? `${exeForm.properties.length} properties` : 'None'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* LibURLs 탭 */}
            {activeTab === 'libURLs' && (
                <div className="executable-form-content">
                    <div className="executable-form-lib-section">
                        <label className="executable-form-label">
                            Input ExForm (url, path of file, exe, sh, ph ...)
                        </label>
                        <input
                            type="text"
                            value={libURLInput}
                            onChange={(e) => setLibURLInput(e.target.value)}
                            className="executable-form-input executable-form-input--full"
                            placeholder="Enter library URL"
                        />

                        <div className="executable-form-actions">
                            <button
                                onClick={handleAddLibURL}
                                className="executable-form-btn"
                                disabled={!libURLInput.trim()}
                            >
                                Add
                            </button>
                            <button
                                onClick={handleUpdateLibURL}
                                className="executable-form-btn"
                                disabled={selectedLibIndex === null}
                            >
                                Update
                            </button>
                            <button
                                onClick={handleDeleteLibURL}
                                className="executable-form-btn executable-form-btn--danger"
                                disabled={selectedLibIndex === null}
                            >
                                Delete
                            </button>
                        </div>

                        {/* LibURL 테이블 */}
                        <div className="executable-form-table-container">
                            <table className="executable-form-table">
                                <thead>
                                    <tr>
                                        <th>Lib Executable Form</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(moduleState.executableForm?.lib?.urlnPaths || []).map((url, index) => (
                                        <tr
                                            key={index}
                                            className={selectedLibIndex === index ? 'selected' : ''}
                                            onClick={() => handleSelectLibURL(index)}
                                        >
                                            <td>{url}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExecutableFormPage; 